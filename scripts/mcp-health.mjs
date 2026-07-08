#!/usr/bin/env node
/** Check remote MCP + API; verify MCP tools/list matches _manifest.yaml */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.warn("warn: missing .env — using defaults (copy .env.EXAMPLE for local overrides)");
    return;
  }
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function expectedTools() {
  const manifestPath = join(root, "_manifest.yaml");
  if (!existsSync(manifestPath)) return [];
  const raw = readFileSync(manifestPath, "utf8");
  const tools = [];
  let inTools = false;
  for (const line of raw.split("\n")) {
    if (line.startsWith("mcp_tools:")) {
      inTools = true;
      continue;
    }
    if (inTools) {
      if (/^\S/.test(line) && !line.startsWith(" ")) break;
      const m = line.match(/^\s+-\s+(\S+)/);
      if (m) tools.push(m[1]);
    }
  }
  return tools;
}

loadEnv();

const apiUrl = (process.env.ADS_AGENT_API_URL || "https://meta-ads-agent.vidau.ai").replace(/\/$/, "");
const mcpUrl = (process.env.ADS_AGENT_MCP_URL || `${apiUrl}/mcp`).replace(/\/$/, "");
const token = process.env.VIDAU_SSO_TOKEN || "";

const baseHeaders = { Accept: "application/json" };
if (token) {
  baseHeaders.Authorization = `Bearer ${token}`;
  baseHeaders["X-Vidau-Token"] = token;
}

async function check(label, url, opts = {}) {
  try {
    const res = await fetch(url, { ...opts, headers: { ...baseHeaders, ...opts.headers } });
    const ok = res.ok;
    console.log(`${ok ? "✓" : "✗"} ${label}: ${res.status} ${url}`);
    if (ok && res.headers.get("content-type")?.includes("json")) {
      const body = await res.json();
      if (body.llm_provider) console.log(`  llm_provider=${body.llm_provider}`);
      if (body.status) console.log(`  status=${body.status}`);
    }
    return { ok, res };
  } catch (err) {
    console.log(`✗ ${label}: ${err.message}`);
    return { ok: false, res: null };
  }
}

async function checkMcpTools() {
  const initBody = JSON.stringify({
    jsonrpc: "2.0",
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "mcp-health", version: "1" },
    },
    id: 1,
  });
  const init = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: initBody,
  });
  if (!init.ok) {
    console.log(`✗ MCP initialize: ${init.status}`);
    return false;
  }
  console.log(`✓ MCP initialize: ${init.status} ${mcpUrl}`);

  const listBody = JSON.stringify({ jsonrpc: "2.0", method: "tools/list", params: {}, id: 2 });
  const listRes = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: listBody,
  });
  if (!listRes.ok) {
    console.log(`✗ MCP tools/list: ${listRes.status}`);
    return false;
  }

  const text = await listRes.text();
  const dataLine = text.split("\n").find((l) => l.startsWith("data: "));
  if (!dataLine) {
    console.log("✗ MCP tools/list: no SSE data line");
    return false;
  }
  const payload = JSON.parse(dataLine.slice(6));
  const names = (payload.result?.tools || []).map((t) => t.name).sort();
  const want = expectedTools().sort();
  console.log(`✓ MCP tools/list: ${names.length} tool(s)`);
  const missing = want.filter((n) => !names.includes(n));
  const extra = names.filter((n) => !want.includes(n));
  if (missing.length) {
    console.log(`  missing vs manifest: ${missing.join(", ")}`);
    return false;
  }
  if (extra.length) {
    console.log(`  extra (not in manifest): ${extra.join(", ")}`);
  }
  console.log(`  tools: ${names.join(", ")}`);
  return true;
}

console.log("meta-ads-agent connectivity check\n");
const api = await check("API /health", `${apiUrl}/health`);
const mcp = await checkMcpTools();
process.exit(api.ok && mcp ? 0 : 1);
