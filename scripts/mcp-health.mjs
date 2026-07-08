#!/usr/bin/env node
/** 检查远程 MCP 与 API 是否可达（需 .env 中 ADS_AGENT_MCP_URL / ADS_AGENT_API_URL） */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error('缺少 .env，请复制 .env.EXAMPLE 并填写 TOKENWARE_API_KEY')
    process.exit(1)
  }
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (!process.env[k]) process.env[k] = v
  }
}

loadEnv()

const apiUrl = (process.env.ADS_AGENT_API_URL || 'https://meta-ads-agent.vidau.ai').replace(/\/$/, '')
const mcpUrl = (process.env.ADS_AGENT_MCP_URL || `${apiUrl}/mcp`).replace(/\/$/, '')
const token = process.env.VIDAU_SSO_TOKEN || ''

const headers = { Accept: 'application/json' }
if (token) {
  headers.Authorization = `Bearer ${token}`
  headers['X-Vidau-Token'] = token
}

async function check(label, url, opts = {}) {
  try {
    const res = await fetch(url, { ...opts, headers: { ...headers, ...opts.headers } })
    const ok = res.ok
    console.log(`${ok ? '✓' : '✗'} ${label}: ${res.status} ${url}`)
    if (ok && res.headers.get('content-type')?.includes('json')) {
      const body = await res.json()
      if (body.llm_provider) console.log(`  llm_provider=${body.llm_provider}`)
      if (body.status) console.log(`  status=${body.status}`)
    }
    return ok
  } catch (err) {
    console.log(`✗ ${label}: ${err.message}`)
    return false
  }
}

console.log('meta-ads-agent connectivity check\n')
const apiOk = await check('API /health', `${apiUrl}/health`)
// MCP streamable-http 需 POST；此处仅探测 endpoint 是否响应
const mcpOk = await check('MCP endpoint', mcpUrl, {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', method: 'initialize', id: 1, params: {} }),
})
process.exit(apiOk && mcpOk ? 0 : 1)
