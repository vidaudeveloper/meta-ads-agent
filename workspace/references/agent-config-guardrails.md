# Agent 配置与 MCP 保护（强制）

> 同等约束已写入 `config.yaml` → `agent.environment_hint` 与 `SOUL.md`。

## 禁止 Agent 修改的配置

| 文件 | 禁止修改的字段 |
|------|----------------|
| `config.yaml` | `model.*`、`providers`、`fallback_providers`、`mcp_servers` |
| `.env` | 任何密钥与凭据 |

## API 403 / 模型不可用

1. **停止** switch_model 或改写 `config.yaml`
2. 告知用户检查 `.env` 中 `TOKENWARE_API_KEY` 与 tokenware 配额
3. **不要**自动切换到其他 provider

## MCP 连接失败

1. 运行 `npm run mcp:health`
2. 检查 `ADS_AGENT_MCP_URL`（staging 用 `.vidau.info`）
3. 确认 VidAU 桌面端已注入 `VIDAU_SSO_TOKEN`
4. MCP 未部署时 Agent 仅能做通用问答，须明确告知用户

## 恢复被改坏的 config

将 `model` 段恢复为 `config.yaml` 顶部注释中的标准值，重启 Agent 会话。
