---
name: compliance
description: "合规门禁 — 发布/一键放量前必过。检查文案、地区披露（巴西等）、法务同意。存在 error 阻断写操作。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, compliance, legal]
    related_skills:
      - orchestrator
      - auto-deploy
      - publish
---

# 合规门禁 Skill

所有 **publish**、**auto-deploy** 写操作前必须执行本 skill。  
backend 侧另有 `compliance/publish_gate.py`、`compliance/campaign.py`；Agent 层做可见性检查与用户告知。

## 检查项

| 项 | 说明 | 失败级别 |
|----|------|----------|
| Meta OAuth | 账户已授权 | error |
| 模块权限 | 用户有 auto-deploy / publish 模块 | error |
| 法务同意 | auto-deploy 须已签署 consent | error |
| 巴西披露 | 投放巴西须含 advertiser identity / DSA | error |
| 文案合规 | 禁词、夸大宣传 | error / warn |
| 预算/地区 | 与 campaign 需求一致 | warn |

## 工作流

1. MCP `fb_auth_status` — OAuth
2. 读取 user-profile 中的地区与合规开关
3. 若涉及巴西 → 确认 DSA / identity 已配置（Web 发布面板）
4. 汇总 **error / warn** 列表
5. **任一 error → 阻断**，返回修复指引 + Web 入口链接

## 汇报格式

```
合规检查
- [error] 未签署一键放量法务同意 → 请在 Web 弹窗完成
- [warn]  日预算低于建议值 → 确认是否继续
```

## 注意

- Agent **不能**代替用户签署法务 consent
- 合规规则以后端为准；本 skill 为 Agent 侧检查清单

详细规则见 `workspace/references/compliance-gates.md`。
