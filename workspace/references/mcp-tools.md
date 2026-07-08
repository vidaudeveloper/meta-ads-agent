# MCP Tools 清单（ads-agent）

远程 MCP：`${ADS_AGENT_MCP_URL}`（默认 `https://meta-ads-agent.vidau.ai/mcp`）

鉴权 Header（VidAU 桌面端自动注入）：

```
Authorization: Bearer <VIDAU_SSO_TOKEN>
X-Vidau-Token: <VIDAU_SSO_TOKEN>
```

## Phase 1（已上线）

| Tool | 说明 | 参数 |
|------|------|------|
| `health` | 后端健康 + llm_provider | 无 |
| `fb_auth_status` | Meta OAuth 状态 | 无 |
| `list_agent_tools` | Agent function-calling 工具列表 | 无 |
| `list_campaigns` | 投放需求列表 | `project?`, `search?` |
| `parse_campaign_text` | 解析运营文本 | `text` |
| `list_auto_deploy_jobs` | 放量任务列表 | `limit?` 默认 20 |
| `get_auto_deploy_job` | 放量任务详情 | `job_id` |

## Phase 2（规划）

| Tool | 说明 |
|------|------|
| `preview_publish_config` | 发布配置预览 |
| `create_auto_deploy_job` | 创建放量（须 confirm） |
| `cancel_auto_deploy_job` | 取消任务 |

## Phase 3（规划）

| Tool | 说明 |
|------|------|
| `list_tracking_campaigns` | 追踪数据 |
| `generate_edit_plan` | 剪辑计划 |

## 使用规则

1. Agent 只调用上表中的 tool，禁止臆造
2. 写操作 tool 必须先过 compliance + 用户确认
3. 错误时原样汇报 MCP/backend 返回的 `msg` 字段

MCP 服务源码：内部 `agent-demo` 仓库 `mcp/ads-agent/server.py`
