# meta-ads-agent — Meta 广告投放 Agent

> **一条指令**：账户检查 → 投放需求解析 → 合规预审 → Meta 发布/放量 → 追踪复盘

VidAU 桌面端 Meta 广告投放 Agent。通过远程 MCP 连接 [meta-ads-agent](https://meta-ads-agent.vidau.ai) 后端 API。

**仓库**：[github.com/vidaudeveloper/meta-ads-agent](https://github.com/vidaudeveloper/meta-ads-agent)  
**作者**：VidAU  
**参考**：[social-agent](https://github.com/vidaudeveloper/social-agent) Profile 结构

## 安装

### 通过 VidAU（推荐）

1. 在 VidAU 中安装本 profile（来源：`github.com/vidaudeveloper/meta-ads-agent`）
2. 复制 `.env.EXAMPLE` 为 `.env`，填写 `TOKENWARE_API_KEY`
3. 测试环境：将 `ADS_AGENT_MCP_URL` 改为 `https://meta-ads-agent.vidau.info/mcp`
4. 运行连通性检查：`npm run mcp:health`
5. 在 VidAU 中选择 **meta-ads-agent** profile 开始对话

`VIDAU_SSO_TOKEN` 由 VidAU 桌面端自动注入，通常无需手填。

### 手动克隆（开发）

```bash
git clone https://github.com/vidaudeveloper/meta-ads-agent.git
cd meta-ads-agent
cp .env.EXAMPLE .env
# 编辑 .env
```

将克隆目录配置为 VidAU 的 profile 路径即可。

> **Agent 禁止修改** `config.yaml` 的 model / mcp_servers 段；详见 `workspace/references/agent-config-guardrails.md`。

## 使用

在 VidAU 中与 meta-ads-agent profile 对话，例如：

```
帮我解析这段投放需求：[粘贴运营文本]

查一下我最近的放量任务

Meta 账户连上了吗？
```

## MCP 工具（Phase 1）

| Tool | 说明 |
|------|------|
| `health` | 后端健康检查 |
| `fb_auth_status` | Meta OAuth 连接状态 |
| `list_campaigns` | 投放需求列表 |
| `parse_campaign_text` | 运营文本 → 结构化字段 |
| `list_auto_deploy_jobs` | 一键放量任务列表 |
| `get_auto_deploy_job` | 放量任务详情 |

MCP 服务部署在 `meta-ads-agent.vidau.ai/mcp`（源码在内部 `agent-demo` 仓库 `mcp/ads-agent/`）。

## 平台能力

| 模块 | Skill | 说明 |
|------|-------|------|
| 总编排 | orchestrator | 完整投放管线 |
| 投放需求 | campaign | 文本解析、列表 |
| 一键放量 | auto-deploy | 须合规 + 用户确认 |
| Meta 发布 | publish | 预览与发布辅助 |
| 素材剪辑 | material-editing | EditPlan + 渲染 |
| 广告追踪 | tracking | 成效查询 |
| 合规门禁 | compliance | 发布/放量前必过 |

## 目录结构

```
meta-ads-agent/
├── distribution.yaml
├── config.yaml
├── SOUL.md
├── package.json
├── scripts/
├── skills/
│   ├── orchestrator/
│   ├── campaign/
│   ├── auto-deploy/
│   ├── publish/
│   ├── material-editing/
│   ├── tracking/
│   └── compliance/
└── workspace/references/
```

## 环境

| 环境 | API | MCP |
|------|-----|-----|
| 正式 | meta-ads-agent.vidau.ai | …/mcp |
| 测试 | meta-ads-agent.vidau.info | …/mcp |

## License

MIT
