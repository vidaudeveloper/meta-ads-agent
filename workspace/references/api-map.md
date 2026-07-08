# API 模块索引

Base URL：`${ADS_AGENT_API_URL}`（默认 `https://meta-ads-agent.vidau.ai`）

## campaign (`/v1/campaign`)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/parse` | 运营文本 → 结构化 |
| GET/POST | `/` | 列表 / 创建 |
| GET/PUT/DELETE | `/{id}` | CRUD |

## fb (`/v1/fb`)

**OAuth**：`/auth/status`, `/oauth/*`, `/accounts`  
**发布**：`/publish`, `/publish/{id}`, `/templates`  
**追踪**：`/tracking/campaigns`, `/tracking/account/daily`  
**放量**：`/auto-deploy`, `/auto-deploy/{job_id}`, `/cancel`  
**拒审**：`/review/ads`, `/review/sync`  
**辅助**：`/adset-options`, `/geo-search`, `/generate-ad-copy`

## edit (`/v1/edit`)

`/upload`, `/plan`, `/render`, `/result/{name}`

## monitor (`/v1/monitor`)

监控规则与告警。

## 鉴权

```
Authorization: Bearer <token>
X-Vidau-Token: <token>
```

Agent 通过 MCP 访问，不直接拼 HTTP。
