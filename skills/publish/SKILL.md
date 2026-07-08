---
name: publish
description: "Meta 广告发布 — 预览发布配置、模板与 Campaign 发布辅助。用户说'发布广告''一键发布''preview config'时使用。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, publish, facebook]
    related_skills:
      - orchestrator
      - compliance
      - campaign
---

# Meta 发布 Skill

从投放需求或模板创建 Meta 广告实体（Campaign → AdSet → Ad）。Agent 以**辅助预览与检查**为主，完整发布流程在 Web UI。

## Phase 1

- MCP `fb_auth_status` 确认 OAuth
- 结合 **campaign** skill 获取需求 ID
- 引导用户在 Web「一键发布」完成素材选择与发布

## Phase 2 MCP Tools（规划）

| Tool | 用途 |
|------|------|
| `preview_publish_config` | 从 campaign_id 预览 publish config |
| `list_publish_templates` | 发布模板列表 |
| `run_publish` | 执行发布（须 confirm） |

## 发布前检查清单

- [ ] Meta OAuth 已连接
- [ ] 像素 / 转化事件与需求一致
- [ ] 落地页 URL 可访问
- [ ] 素材已过审或在素材库中
- [ ] **compliance** skill 无 error
- [ ] 用户已确认配置摘要

## 注意

- 发布失败常见原因：账户受限、素材拒审、预算低于最低限额
- 一个 publish 失败不阻塞其他操作汇报
