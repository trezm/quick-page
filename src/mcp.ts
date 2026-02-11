import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import type { Application, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateId, createPage } from "./db.js";

const BASE_URL = process.env.BASE_URL || "https://quick-page.petemertz.com";

function createMcpServer() {
  const server = new McpServer({
    name: "quick-page",
    version: "1.0.0",
  });

  server.tool(
    "create_quick_page",
    "Create a new Quick Page — a hosted, shareable one-page TSX application. The code should export a default component. React hooks and Tailwind CSS are available globally. Recharts is available for data visualization. Returns a URL to view the rendered page.",
    {
      code: z.string().describe("TSX source code. Must use `export default` for the root component. React, Tailwind CSS, and Recharts are available without bundling."),
      password: z.string().optional().describe("Optional password to protect the page"),
    },
    async ({ code, password }) => {
      const id = generateId();
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;
      createPage(id, code, passwordHash);

      const url = `${BASE_URL}/p/${id}`;
      const parts = [`Page created: ${url}`];
      if (password) parts.push(`Password: ${password}`);
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
    console.log(`MCP POST from ${req.ip} - UA: ${req.get("user-agent")} - Accept: ${req.get("accept")}`);
    console.log(`MCP POST body: ${JSON.stringify(req.body)}`);
    console.log(`MCP POST headers: session=${req.headers["mcp-session-id"]}, content-type=${req.get("content-type")}`);
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId && transports.has(sessionId)) {
      console.log(`MCP: Found existing transport for session ${sessionId}`);
      const transport = transports.get(sessionId)!;
      // Intercept response
      const origWrite = res.write.bind(res);
      const origEnd = res.end.bind(res);
      res.write = function(...args: any[]) {
        console.log(`MCP response write: ${args[0]?.toString?.()?.substring(0, 500)}`);
        return origWrite(...args);
      } as any;
      const origSetHeader = res.setHeader.bind(res);
      res.setHeader = function(name: string, value: any) {
        console.log(`MCP response header: ${name}=${value}`);
        return origSetHeader(name, value);
      };
      res.on('finish', () => {
        console.log(`MCP response finished: status=${res.statusCode}, content-type=${res.getHeader('content-type')}`);
      });
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // New session
    console.log(`MCP: Creating new transport`);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      enableJsonResponse: true,
    });
    const server = createMcpServer();

    transport.onclose = () => {
      if (transport.sessionId) transports.delete(transport.sessionId);
    };

    await server.connect(transport);
    console.log(`MCP: Server connected, sessionId=${transport.sessionId}`);

    if (transport.sessionId) {
      transports.set(transport.sessionId, transport);
      console.log(`MCP: Stored transport for session ${transport.sessionId}`);
    }

    // Intercept response
    res.on('finish', () => {
      console.log(`MCP init response finished: status=${res.statusCode}, content-type=${res.getHeader('content-type')}`);
    });
    await transport.handleRequest(req, res, req.body);
    console.log(`MCP: handleRequest completed, sessionId now=${transport.sessionId}`);
  });

  app.get("/mcp", async (req: Request, res: Response) => {
    console.log(`MCP GET from ${req.ip} - UA: ${req.get("user-agent")} - Session: ${req.headers["mcp-session-id"]}`);
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
