# VidAU Desktop 联调 Checklist

Profile: `github.com/vidaudeveloper/meta-ads-agent` · Tag `v1.0.0+`

## 前置

- [ ] VidAU 桌面端已登录 SSO（token 可注入 profile env）
- [ ] 目标环境 MCP 已部署（staging / prod）
- [ ] 用户已在 Web UI 完成 Meta OAuth 绑定

## 1. 安装 Profile

- [ ] VidAU → 添加 Profile → `vidaudeveloper/meta-ads-agent`
- [ ] 复制 `.env.EXAMPLE` → `.env`，填写 `TOKENWARE_API_KEY`
- [ ] staging 测试时：`ADS_AGENT_MCP_URL=https://meta-ads-agent.vidau.info/mcp`

## 2. MCP 连通

- [ ] Profile MCP `ads-agent` 指向正确 URL
- [ ] Headers 含 `Authorization` + `X-Vidau-Token`（`${VIDAU_SSO_TOKEN}`）
- [ ] Reload MCP 后 `tools/list` 返回 **10** tools（Phase 2 起）
- [ ] 本地验证：`npm run mcp:health` 全部 ✓

## 3. Skills 安装

- [ ] 执行 `docs/SETUP.md` Step 2 或 `npm run skills:install`
- [ ] `npm run skills:validate` 通过（7 skills）
- [ ] `/reset` 重启会话

## 4. 只读冒烟（Phase 1）

| 提示词 | 期望 MCP Tool |
|--------|---------------|
| Meta 账户连上了吗？ | `fb_auth_status` |
| 有哪些投放需求？ | `list_campaigns` |
| 查一下我最近的放量任务 | `list_auto_deploy_jobs` |
| 帮我解析这段投放需求：[文本] | `parse_campaign_text` |

- [ ] Agent 实际调用了上表 tool（非臆造）
- [ ] 错误时原样展示 backend `msg`

## 5. 写操作（Phase 2，须确认）

| 提示词 | 期望行为 |
|--------|----------|
| 预览投放需求 #123 的发布配置 | `preview_publish_config` |
| 帮我创建放量任务（先 dry-run） | `create_auto_deploy_job` + `validate_only=true` |
| 取消任务 #456 | 先确认 → `cancel_auto_deploy_job` |

- [ ] 写操作前加载 compliance skill
- [ ] 未获用户「确认执行」前不调用 `validate_only=false`
- [ ] dry-run 失败时展示 `compliance_errors` 摘要

## 6. 回归

- [ ] staging 通过后，prod URL 再跑一遍 Step 2–5
- [ ] 记录联调日期、VidAU 版本、失败截图/日志
