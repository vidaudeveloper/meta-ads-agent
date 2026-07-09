---
name: orchestrator
description: "Meta 投放管线编排器 — 用户说'帮我投放''查放量''解析投放需求'时激活。按 Step 0→6 顺序执行，MCP 查数据、compliance 门禁、用户确认后再写操作。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, orchestrator, facebook, pipeline]
    related_skills:
      - campaign
      - auto-deploy
      - publish
      - compliance
      - tracking
      - material-editing
---

# Meta 投放管线编排器

**触发条件**：用户说「帮我投放」「解析投放需求」「查放量任务」「Meta 账户状态」「跑一遍投放流程」  
**不要用于**：纯代码开发、服务器部署、与 Meta 无关的通用问答

## Step 0: 初始化用户画像

读取 `workspace/user-profile.md`。不存在则一次性收集：

- 常用 Meta 广告账户 / 项目方
- 目标投放地区（含是否涉及巴西等合规地区）
- 是否开启 auto-deploy / 自动发布

写入后再进入 Step 1。

## Step 1: 账户检查

调用 MCP **`fb_auth_status`**。按返回分流：

| 结果 | 含义 | 对用户说 |
|------|------|----------|
| HTTP/工具错误含 `401`、`SSO`、`未登录`、`未关联本地用户` | **身份问题** | 请在 VidAU 桌面端重新登录 SSO 后重试；**不要**先引导去绑 Meta |
| HTTP 200 且 `authorized: false` / `needs_reauth` | **Meta OAuth 未绑定或失效** | 请打开 https://meta-ads-agent.vidau.ai（staging: `.vidau.info`）完成「连接 Ads Manager」 |
| HTTP 200 且 `authorized: true` | 已连接 | 继续后续步骤 |

不要尝试绕过 OAuth 或编造 token。

## Step 2: 投放需求

| 用户意图 | MCP Tool |
|----------|----------|
| 解析运营粘贴文本 | `parse_campaign_text` |
| 查看已有需求 | `list_campaigns` |

输出结构化字段表（项目方、像素、预算、地区、落地页等），请用户确认是否正确。

## Step 3: 合规预审

加载 **compliance** skill。存在 **error** → 暂停，返回修复清单；仅 warn → 询问是否继续。

## Step 4: 发布 / 放量预览（Phase 2 写工具）

- 发布：加载 **publish** skill
- 放量：加载 **auto-deploy** skill，MCP `list_auto_deploy_jobs` / `get_auto_deploy_job`

## Step 4.9: 用户确认（写操作前必须）

展示：

1. 操作类型（发布 / 创建放量 / 改预算）
2. 关键参数摘要（账户、预算、地区、素材数）
3. 合规检查结果

**等待用户明确说「确认执行」** 后再调用写工具。

## Step 5: 执行

Phase 2 起启用 MCP 写工具。Phase 1 仅查询时到此步输出「需在 Web UI 完成」的指引。

## Step 6: 追踪复盘

加载 **tracking** skill，MCP 查询成效（Phase 3）。

## MCP 使用规则

1. 只使用 `workspace/references/mcp-tools.md` 列出的 tool 名
2. 禁止臆造 API 路径
3. 失败时报告 MCP 返回的错误信息，不 silent retry 超过 2 次
