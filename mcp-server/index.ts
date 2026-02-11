import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.QUICK_PAGE_URL || "https://quick-page.petemertz.com";

const server = new McpServer({
  name: "quick-page",
  version: "1.0.0",
});

server.tool(
  "create_quick_page",
  "Create a new Quick Page — a hosted one-page TSX application. The code should export a default component (e.g. `export default function MyPage() { ... }`). React hooks and Tailwind CSS are available globally. Recharts is also available for data visualization. Returns a URL to view the rendered page.",
  {
    code: z.string().describe("TSX source code. Must export a default component or define an App component. React, Tailwind CSS, and Recharts are available."),
    password: z.string().optional().describe("Optional password to protect the page"),
  },
  async ({ code, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password: password || undefined }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }));
        return {
          content: [{ type: "text" as const, text: `Error creating page: ${error.error || res.statusText}` }],
          isError: true,
        };
      }

      const data = await res.json();
      const parts = [`Page created: ${data.url}`];
      if (password) parts.push(`Password: ${password}`);
      return { content: [{ type: "text" as const, text: parts.join("\n") }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Failed to reach Quick Page API: ${e.message}` }],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
