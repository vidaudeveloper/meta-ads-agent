---
name: material-editing
description: "素材剪辑 — 自然语言需求转 EditPlan(JSON)，人审后 ffmpeg 确定性出片。涵盖 @视频1/@图片1 引用、抠像、背景替换、手指点击。"
version: 1.0.0
author: meta-ads-agent
license: MIT
metadata:
  hermes:
    tags: [meta-ads, editing, video, ffmpeg]
    related_skills:
      - orchestrator
---

# 素材剪辑 Skill

把「自然语言需求 + 素材」翻译成可人审的 `EditPlan`，确认后由服务端 ffmpeg 渲染出片。  
**模型只产计划、不碰像素**；禁止跳过人审直接渲染。

## 工作流

```
- [ ] 1. 用户在 Web 上传素材（视频1/图片1/音频1）
- [ ] 2. 写需求，用 @视频1 @图片1 点名素材
- [ ] 3. 生成 EditPlan（MCP generate_edit_plan，Phase 2 / 或 Web API）
- [ ] 4. 人审：段时长、source、matte/背景
- [ ] 5. 用户确认后渲染（SSE 进度）
- [ ] 6. 预览成片，不满意改 EditPlan 重渲
```

## 素材引用

- key 即引用名（`视频1`/`图片1`/`音频1`），需求里写 `@视频1`
- 口播/人物 → `video_region` + `matte:true`
- 背景图 → `background`（可 scroll）
- 音频 → `audio.source` 或 keep 视频音轨

## EditPlan 结构（摘要）

```json
{
  "assets": {"视频1": "<url>", "图片1": "..."},
  "output": {"width": 720, "height": 1280, "fps": 30},
  "audio": {"mode": "replace", "source": "音频1"},
  "segments": [
    {
      "name": "开头",
      "duration": 8.0,
      "background": {"kind": "image", "source": "图片1", "fit": "cover"},
      "overlays": [
        {"type": "video_region", "source": "视频1", "matte": true, "pos": ["left","bottom"]}
      ]
    }
  ]
}
```

## API 参考

| 路径 | 说明 |
|------|------|
| POST /v1/edit/plan | 生成 EditPlan |
| POST /v1/edit/render | SSE 渲染 |
| GET /v1/edit/result/{name} | 取成片 |

Phase 1：引导 Web「素材剪辑」模块；Phase 2 通过 MCP 封装上述接口。

## 注意

- 渲染耗时可能数分钟，须告知用户等待 SSE 进度
- 抠像不可用时会退化为裁剪叠加，须在计划中标注
