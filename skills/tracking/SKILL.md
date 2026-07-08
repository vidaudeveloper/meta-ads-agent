---
name: tracking
description: "广告追踪与拒审 — 查询 Campaign/账户成效、拒审广告同步状态。用户说'看数据''追踪''拒审'时使用。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, tracking, insights, review]
    related_skills:
      - orchestrator
---

# 广告追踪 Skill

查询 Meta 广告投放成效与拒审状态。Phase 1 引导 Web 仪表盘；Phase 3 通过 MCP 封装 tracking API。

## Web 模块

| 模块 | 路径 |
|------|------|
| 广告追踪 | /v1/fb/tracking/campaigns |
| 账户日报 | /v1/fb/tracking/account/daily |
| 拒审同步 | /v1/fb/review/ads |

## Phase 3 MCP Tools（规划）

| Tool | 用途 |
|------|------|
| `list_tracking_campaigns` | Campaign 成效列表 |
| `get_account_daily_insights` | 账户日报 |
| `list_review_ads` | 拒审广告 |

## 汇报格式

成效表须含：花费、展示、点击、转化、CPA/ROAS（按账户主指标）。  
拒审须含：广告 ID、拒审原因摘要、建议动作。

## 注意

- 数据有 Meta API 同步延迟（通常 15min～数小时）
- 管理员 overview 与普通用户可见范围不同
