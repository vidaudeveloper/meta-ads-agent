# VidAU Meta Ads Agent — One-Click Setup

Please complete the full Meta Ads Agent setup in the following order:

1. **MCP**: Check whether `ads-agent` is already connected and working. If not, configure the MCP server `ads-agent` to point to `https://meta-ads-agent.vidau.ai/mcp` (staging: `https://meta-ads-agent.vidau.info/mcp`).

   **Unlike creative-agent, Authorization is required.** Headers must include:
   - `Authorization: Bearer ${VIDAU_SSO_TOKEN}`
   - `X-Vidau-Token: ${VIDAU_SSO_TOKEN}`

   VidAU desktop should inject `VIDAU_SSO_TOKEN` automatically after SSO login. Reload MCP and verify the connection is healthy (`tools/list` returns 10 tools).

2. **Skills**: Install **all** Skills from `https://github.com/vidaudeveloper/meta-ads-agent` (branch `main`). **Do not** use `raw.githubusercontent.com` URLs — they often return HTTP 429. The skill list is defined in `_manifest.yaml` — never hardcode skill names.

   **Preferred (one shallow clone, zero raw CDN requests):**

   ```bash
   git clone --depth 1 https://github.com/vidaudeveloper/meta-ads-agent.git /tmp/meta-ads-agent
   node /tmp/meta-ads-agent/scripts/install-skills.mjs --force
   ```

   The script reads local `_manifest.yaml`, then copies every `skills[].path` into `~/.hermes/skills/vidau-meta-ads/`.

   **Fallback A (no local copy, but git available):**

   ```bash
   git clone --depth 1 https://github.com/vidaudeveloper/meta-ads-agent.git /tmp/meta-ads-agent
   node /tmp/meta-ads-agent/scripts/install-skills.mjs --remote --force
   ```

   **Fallback B (no git):** fetch `_manifest.yaml` via GitHub Contents API (not raw CDN), parse every `skills[].path` in manifest order, and for each path run:

   ```bash
   hermes skills install vidaudeveloper/meta-ads-agent/<path> --force --yes --category vidau-meta-ads
   ```

   Manifest URL: `https://api.github.com/repos/vidaudeveloper/meta-ads-agent/contents/_manifest.yaml?ref=main` (decode the `content` field from base64).

   Or run the install script with API-fetched manifest:

   ```bash
   node install-skills.mjs --from-github --force
   ```

   After installation, verify that the installed skill list matches every `skills[].id` in `_manifest.yaml`.

3. **Env**: Copy `.env.EXAMPLE` to `.env` and fill `TOKENWARE_API_KEY`. Run connectivity check:

   ```bash
   npm run mcp:health
   ```

4. **Apply changes**: Run `/reset` (or `/new`) to restart the session so MCP and Skills all take effect.

## Quick test prompts

```
Meta 账户连上了吗？
查一下我最近的放量任务
帮我解析这段投放需求：[粘贴文本]
```
