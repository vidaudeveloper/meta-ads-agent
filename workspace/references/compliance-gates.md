# 合规门禁参考

## auto-deploy

- 用户须在 Web 完成 **AutoDeployConsentDialog** 法务同意
- backend：`compliance/publish_gate.py`、`auto_deploy_compliance`
- 未同意时 API 返回 403，Agent 引导 Web 完成签署

## 巴西投放

- 须配置 advertiser identity / DSA（`brazil-identities`, `dsa-recommendations` API）
- 文案含必要披露语句
- 详见内部 spec：`2026-06-30-brazil-ad-disclosure`

## 文案检查

- backend `compliance/copy_check.py`
- 禁词、夸大、未授权承诺

## Agent 行为

| 级别 | 行为 |
|------|------|
| error | 阻断写操作，给出 Web 修复入口 |
| warn | 展示警告，询问用户是否继续 |
| pass | 进入 Step 4.9 用户确认 |

Agent **不能**代替用户点击同意按钮或绕过 gate。
