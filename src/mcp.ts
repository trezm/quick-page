import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import type { Application } from "express";
import bcrypt from "bcryptjs";
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
  const transports = new Map<string, SSEServerTransport>();

  app.get("/mcp/sse", async (req, res) => {
    const mcpServer = createMcpServer();
    const transport = new SSEServerTransport("/mcp/messages", res);
    transports.set(transport.sessionId, transport);

    res.on("close", () => {
      transports.delete(transport.sessionId);
      mcpServer.close();
    });

    await mcpServer.connect(transport);
  });

  app.post("/mcp/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    await transport.handlePostMessage(req, res);
  });
}
