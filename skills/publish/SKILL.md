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

## MCP Tools

| Tool | 用途 |
|------|------|
| `fb_auth_status` | 确认 Meta OAuth 已连接 |
| `preview_publish_config` | 从 `campaign_id` 预览 publish config |

完整发布（素材选择、账户绑定）仍在 Web「一键发布」完成。

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
