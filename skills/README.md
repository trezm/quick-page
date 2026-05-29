# Quick Page agent skills

Drop-in skills that teach popular agent frameworks to publish interactive TSX
pages to Quick Page and hand the user a shareable link.

Both target the public MCP server at `https://quick-page.petemertz.com/mcp`
(Streamable HTTP, no auth) and its `create_quick_page` tool. No server-side
changes are needed to use them.

## Files

| File | Framework | Format |
| --- | --- | --- |
| [`hermes/SKILL.md`](hermes/SKILL.md) | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | `SKILL.md` frontmatter |
| [`openclaw/SOUL.md`](openclaw/SOUL.md) | [openclaw/openclaw](https://github.com/openclaw/openclaw) | `SOUL.md` config |

## Installing

**Hermes** — copy `hermes/SKILL.md` into your Hermes `skills/quick-page/`
directory and add the MCP server to your config (see the skill's
`## Prerequisites`).

**OpenClaw** — copy `openclaw/SOUL.md` into your agent directory (`cp
skills/openclaw/SOUL.md ./SOUL.md`) and connect the MCP server.

## Distribution

The discovery channel for both ecosystems is their community registry, not this
repo. To reach users, open a PR adding these skills to:

- Hermes: [0xNyk/awesome-hermes-agent](https://github.com/0xNyk/awesome-hermes-agent)
- OpenClaw: [mergisi/awesome-openclaw-agents](https://github.com/mergisi/awesome-openclaw-agents)
