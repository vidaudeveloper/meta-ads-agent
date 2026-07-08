# VidAU Meta Ads Agent Skills

> **Repo**: [meta-ads-agent](https://github.com/vidaudeveloper/meta-ads-agent)  
> **MCP server**: `ads-agent` → `https://meta-ads-agent.vidau.ai/mcp`

## Install

One-click: copy [docs/SETUP.md](./docs/SETUP.md) into Agent chat (MCP first, then Skills, then `/reset`).

```bash
npm run skills:install
npm run mcp:health
```

## Working with MCP

1. **MCP** (Meta Ads API): `mcp_servers.ads-agent.url` → `https://meta-ads-agent.vidau.ai/mcp`
2. **Auth**: requires `VIDAU_SSO_TOKEN` in headers (desktop injects automatically)
3. **Skills** (workflows): see [SETUP.md](./docs/SETUP.md) and [`_manifest.yaml`](./_manifest.yaml)

## Maintenance

```bash
npm run skills:validate
npm run mcp:health
```

## MCP tools reference

### Phase 1 (read-only)

| Tool | Description | Auth required |
|------|-------------|---------------|
| `health` | Backend health + llm_provider | No |
| `list_agent_tools` | Facebook Agent function-calling schemas | Yes |
| `fb_auth_status` | Meta OAuth connection status | Yes |
| `list_campaigns` | List campaign requests (投放需求) | Yes |
| `parse_campaign_text` | Parse ops text → structured fields | Yes |
| `list_auto_deploy_jobs` | List auto-deploy jobs | Yes |
| `get_auto_deploy_job` | Auto-deploy job detail | Yes |

### Phase 2 (write — confirm + compliance)

| Tool | Description |
|------|-------------|
| `preview_publish_config` | Preview publish params from campaign_id |
| `create_auto_deploy_job` | Create auto-deploy job (`validate_only` dry-run first) |
| `cancel_auto_deploy_job` | Cancel running job (user confirmation required) |

Phase 3 (planned): `list_tracking_campaigns`, `generate_edit_plan`

## Skill layers

| Layer | Skills |
|-------|--------|
| **L0-foundation** | `orchestrator`, `compliance`, `campaign` |
| **L1-capability** | `auto-deploy`, `publish`, `material-editing`, `tracking` |

See [`_manifest.yaml`](./_manifest.yaml) for `requires` and `mcp_tools` per skill.
