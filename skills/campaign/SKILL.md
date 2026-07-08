---
name: campaign
description: "投放需求管理 — 解析运营粘贴文本、查询投放需求列表。用户提到项目方/像素/日预算/投放地区时使用。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, campaign, 投放需求]
    related_skills:
      - orchestrator
      - compliance
      - publish
---

# 投放需求 Skill

运营通过粘贴结构化文本录入投放需求。Agent 通过 MCP 解析与查询，**创建/更新** Phase 2 前引导用户用 Web UI。

## MCP Tools

| Tool | 用途 |
|------|------|
| `parse_campaign_text` | 运营文本 → 结构化字段 |
| `list_campaigns` | 列表；可选 `project` / `search` 筛选 |

## 字段说明

| 字段 | 常见标签 |
|------|----------|
| project_name | 项目方 |
| pixel_id | 像素编号 |
| landing_url | 投放链接 |
| daily_budget | 日测试预算 |
| target_region | 投放地区 |
| event_type | 事件 |
| product_code | 产品编号 |
| expected_kpi | 预期 KPI |
| product_name | 产品名称 |
| official_url | 官网链接 |
| creative_language | 素材语言要求 |

## 工作流

1. 用户提供粘贴文本 → `parse_campaign_text`
2. 以表格展示解析结果，请用户确认
3. 需要查历史 → `list_campaigns`
4. 确认入库 → 引导 Web「投放需求」模块或 Phase 2 MCP 写工具

## 注意

- 解析结果可能有空字段，标注「待补充」
- 权限：用户仅能看自己有权限的需求（backend 侧过滤）
