import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { Application, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateId, generateEditToken, createPage, getPage, updatePage } from "./db.js";

const BASE_URL = process.env.BASE_URL || "https://quick-page.petemertz.com";

function createMcpServer() {
  const server = new McpServer({
    name: "quick-page",
    version: "1.0.0",
  });

  server.tool(
    "create_quick_page",
    "Create a new Quick Page — a hosted, shareable one-page TSX application. The code should export a default component. React hooks and Tailwind CSS are available globally. Recharts (charts) and lucide-react (icons) are available for import. No other npm packages are bundled — inline everything else. Returns a view URL for sharing and an edit URL (a secret link) the creator can use to revise the page.",
    {
      code: z.string().describe("TSX source code. Must use `export default` for the root component. Available imports: react, recharts, lucide-react. Tailwind CSS classes work directly. Do not import any other npm packages — they are not bundled."),
      password: z.string().optional().describe("Optional password to protect the page"),
    },
    async ({ code, password }) => {
      const id = generateId();
      const editToken = generateEditToken();
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;
      createPage(id, code, passwordHash, editToken);

      const url = `${BASE_URL}/p/${id}`;
      const editUrl = `${BASE_URL}/e/${id}/${editToken}`;
      const parts = [
        `Page created: ${url}`,
        `Page id: ${id}`,
        `Update token (keep private): ${editToken}`,
        `Edit URL (web): ${editUrl}`,
        `To revise this page later, call update_quick_page with the id and update token above. The token changes on every update.`,
      ];
      if (password) parts.push(`Password: ${password}`);
      return { content: [{ type: "text" as const, text: parts.join("\n") }] };
    }
  );

  server.tool(
    "update_quick_page",
    "Update an existing Quick Page's code (and optionally its password). Requires the secret update token from when the page was created or last updated. Pages created before update tokens existed can be updated once without a token. Returns the view URL and a NEW update token — the previous token is invalidated on every update, so save the new one for the next edit.",
    {
      id: z.string().describe("The page id — the part after /p/ in the page's URL."),
      token: z.string().optional().describe("The secret update token returned by the last create/update. Required for any page that already has one; optional only for legacy pages that have never had a token."),
      code: z.string().describe("New TSX source code that fully replaces the page. Same constraints as create_quick_page: `export default` root component; only react, recharts, lucide-react may be imported; Tailwind classes work directly."),
      password: z.string().optional().describe("Set or change the page password. Omit to leave the existing password unchanged."),
      clearPassword: z.boolean().optional().describe("Set true to remove password protection from the page."),
    },
    async ({ id, token, code, password, clearPassword }) => {
      const page = getPage(id);
      if (!page) {
        return { content: [{ type: "text" as const, text: `No page found with id "${id}".` }], isError: true };
      }
      // A token is required only once a page has one. Legacy pages with no token
      // can be claimed by their first update.
      if (page.edit_token && page.edit_token !== token) {
        return { content: [{ type: "text" as const, text: "Invalid or missing update token for this page." }], isError: true };
      }

      let passwordHash = page.password_hash;
      if (clearPassword) {
        passwordHash = null;
      } else if (password) {
        passwordHash = await bcrypt.hash(password, 10);
      }

      const newToken = updatePage(page.id, code, passwordHash);

      const url = `${BASE_URL}/p/${page.id}`;
      const editUrl = `${BASE_URL}/e/${page.id}/${newToken}`;
      const parts = [
        `Page updated: ${url}`,
        `New update token (keep private): ${newToken}`,
        `Edit URL (web): ${editUrl}`,
        `The previous token no longer works — use this one for the next update.`,
      ];
      return { content: [{ type: "text" as const, text: parts.join("\n") }] };
    }
  );

  return server;
}

export function setupMcp(app: Application) {
  const transports = new Map<string, StreamableHTTPServerTransport>();

  // Disable Cloudflare buffering for MCP endpoints (SSE/streaming)
  app.use("/mcp", (_req: Request, res: Response, next) => {
    res.setHeader("X-Accel-Buffering", "no");
    next();
  });

  app.post("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // A session ID was provided but we don't know it — e.g. the server
    // restarted and lost its in-memory session map. Respond 404 so the client
    // discards the stale session and re-initializes, instead of falling through
    // and feeding a non-initialize request into a fresh transport (which would
    // confusingly fail with "Server not initialized").
    if (sessionId) {
      res.status(404).json({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Session not found" },
        id: req.body?.id ?? null,
      });
      return;
    }

    // No session ID: only an initialize request may start a new session.
    if (!isInitializeRequest(req.body)) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: initialize required to start a session" },
        id: req.body?.id ?? null,
      });
      return;
    }

    // New session
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      enableJsonResponse: true,
    });
    const server = createMcpServer();

    transport.onclose = () => {
      if (transport.sessionId) transports.delete(transport.sessionId);
    };

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    // Session ID is assigned during handleRequest (when initialize is processed)
    if (transport.sessionId) {
      transports.set(transport.sessionId, transport);
    }
  });

  app.get("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).json({ error: "Invalid or missing session ID. Use POST /mcp to initialize." });
      return;
    }
    const transport = transports.get(sessionId)!;
    await transport.handleRequest(req, res);
  });

  app.delete("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.close();
      transports.delete(sessionId);
    }
    res.status(200).end();
  });
}
