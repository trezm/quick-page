---
name: quick-page
description: Publish interactive React (TSX) pages — dashboards, charts, calculators, small apps — to a permanent, shareable URL so the user can open results in their browser instead of reading them in chat. Use whenever you build something visual or interactive for the user.
version: 1.0.0
author: Quick Page
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    category: productivity
    tags: [hosting, react, tsx, dashboard, visualization, sharing, charts]
    related_skills: [github]
---

# Quick Page

Quick Page turns a single TSX component into a live, hosted web page with a
shareable URL. Use it whenever the best answer to the user is something they
should **see and interact with** — a dashboard, a chart, a calculator, a small
form, a data explorer — rather than a wall of text or a code block they have to
run themselves.

## Prerequisites

This skill calls the **`quick-page` MCP server**. Configure it once:

- **URL:** `https://quick-page.petemertz.com/mcp`
- **Transport:** Streamable HTTP
- **Auth:** none

Add it to your Hermes MCP config, e.g.:

```toml
[mcp.servers.quick-page]
url = "https://quick-page.petemertz.com/mcp"
transport = "http"
```

Once connected, the `create_quick_page` tool becomes available.

## When to use

Reach for Quick Page when the user asks for, or would clearly benefit from:

- A **dashboard** or report built from data you've gathered or computed.
- A **chart / visualization** (Recharts is available — line, bar, area, pie).
- An **interactive tool** — calculator, converter, form, quiz, simulator.
- Anything they'll likely want to **revisit or share** with someone else.

Don't use it for plain prose answers, code the user explicitly asked to receive
as source, or content that isn't visual/interactive.

## How to use

Call `create_quick_page` with a `code` argument containing a complete TSX file.
Optionally pass a `password` to lock the page.

The tool returns two URLs:

1. **View URL** (`/p/<id>`) — give this to the user. It's what they open and
   can share with anyone.
2. **Edit URL** (`/e/<id>/<token>`) — a secret link that opens the page back up
   in an editor with the current code pre-filled. Keep it so you (or the user)
   can revise the page later. Treat it like a password — anyone with the link
   can edit the page.

Always surface **both** to the user, e.g.:

> Here's your dashboard: https://quick-page.petemertz.com/p/abc123
> Want to tweak it yourself? Edit here: https://quick-page.petemertz.com/e/abc123/…

## Writing Quick Pages — house style

The page renders in the browser via Babel standalone. Follow these rules or the
page will fail to compile:

- **Export a default component:** `export default function App() { … }`.
- **React hooks are global** — `useState`, `useEffect`, `useMemo`, etc. You may
  also `import { useState } from "react"`; both work.
- **Tailwind CSS is available** via CDN — use utility classes directly.
- **Recharts is available** — `import { LineChart, Line, XAxis, … } from "recharts"`.
- **lucide-react is available** — `import { Check, ArrowRight, … } from "lucide-react"`.
  Aliased imports (`import { Check as CheckIcon }`) also work.
- **No other npm packages.** No `framer-motion`, no other icon sets, no fetch to
  packages that aren't bundled, no CSS
  imports, no image files. Everything must be self-contained in the one file.
- **Inline your data.** The page is static and standalone — bake any data the
  user needs directly into the component as constants.

### Minimal example

```tsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Count: {count}</h1>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
```

### Chart example

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 6800 },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Revenue</h1>
      <div className="h-80 bg-slate-900 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

## Revising a page

To change a page after it's created, open the **edit URL** in a browser — it
loads the current code in an editor where you can update the TSX, rotate or
remove the password, and save. The view URL stays the same after edits.
