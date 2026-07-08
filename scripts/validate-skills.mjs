#!/usr/bin/env node
/**
 * Validate all SKILL.md files and cross-check against _manifest.yaml.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      files.push(...(await walk(p)));
    } else if (e.name === "SKILL.md") files.push(p);
  }
  return files;
}

function parseManifestIds(raw) {
  const ids = [];
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s+-\s+id:\s+(\S+)/);
    if (m) ids.push(m[1]);
  }
  return ids;
}

const manifestRaw = await readFile(join(repoRoot, "_manifest.yaml"), "utf8");
const manifestIds = parseManifestIds(manifestRaw);
const skillFiles = await walk(join(repoRoot, "skills"));
let ok = true;

for (const file of skillFiles) {
  const text = await readFile(file, "utf8");
  if (!text.includes("name:") || !text.includes("description:")) {
    console.error(`[invalid] ${file}: missing frontmatter name/description`);
    ok = false;
  } else if (!text.includes("metadata:") || !text.includes("hermes:")) {
    console.error(`[invalid] ${file}: missing metadata.hermes block`);
    ok = false;
  } else {
    console.log(`[ok] ${file}`);
  }
}

const skillDirNames = skillFiles.map((f) => {
  const parts = f.split(/[/\\]/);
  return parts[parts.length - 2];
});

for (const id of manifestIds) {
  if (!skillDirNames.includes(id)) {
    console.error(`[manifest] missing skill directory for id=${id}`);
    ok = false;
  }
}

for (const name of skillDirNames) {
  if (!manifestIds.includes(name)) {
    console.error(`[manifest] skill ${name} not listed in _manifest.yaml`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log(`Validated ${skillFiles.length} skill(s); manifest lists ${manifestIds.length} id(s).`);
