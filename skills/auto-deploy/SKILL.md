---
name: auto-deploy
description: "一键放量 — 查询/创建 Meta 自动放量任务。用户说'放量''auto deploy''批量建广告'时使用。写操作须 compliance + 用户确认。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, auto-deploy, 放量]
    related_skills:
      - orchestrator
      - compliance
      - publish
      - campaign
---

# 一键放量 Skill

一键放量（Auto Deploy）按模板批量创建 Campaign / AdSet / Ad。Agent **Phase 1 仅查询**；创建/取消须用户确认 + compliance 通过。

## MCP Tools（Phase 1 查询 + Phase 2 写）

| Tool | 用途 |
|------|------|
| `list_auto_deploy_jobs` | 当前用户最近任务（`limit` 默认 20） |
| `get_auto_deploy_job` | 任务详情（含子 task 状态） |
| `create_auto_deploy_job` | 创建任务（先 `validate_only=true` dry-run） |
| `cancel_auto_deploy_job` | 取消运行中任务 |

## 查询汇报格式

```
| 任务 ID | 状态 | 创建时间 | 成功/失败/总数 |
```

失败 task 须列出 `error` 摘要，建议用户去 Web UI「一键放量」查看详情。

## 写操作（须确认）

创建任务前：

1. 加载 **compliance** skill
2. 展示：账户、模板、素材数、预算、地区
3. 先调用 `create_auto_deploy_job` + `validate_only=true` dry-run
4. 等用户「确认执行」后，`validate_only=false` 正式提交

取消任务：同样须确认后调用 `cancel_auto_deploy_job`。

## 合规

- 巴西等地区须满足 disclosure 要求（见 compliance skill）
- 未签署 auto-deploy 法务同意的账户，backend 会拒绝

## Web UI

复杂配置（多账户、文案矩阵、素材挑选）优先引导用户打开 Web「一键放量」面板。
