import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const workerSource = path.join(rootDir, "src", "worker", "index.js");
const workerOutputDir = path.join(rootDir, "deploy", "worker");
const workerOutput = path.join(workerOutputDir, "index.js");
const staticDir = path.join(rootDir, "deploy", "static");

const forbiddenNames = new Set([
  ".ds_store",
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test",
  "archive.zip"
]);

const forbiddenExtensions = new Set([
  ".md",
  ".psd",
  ".fig",
  ".sketch",
  ".zip",
  ".tar",
  ".gz",
  ".tgz",
  ".log"
]);

const forbiddenPatterns = [
  /(?:^|\/)(?:copy|backup|draft|notes?|prompts?)(?:[._-]|\/|$)/i,
  /(?:^|\/)[^/]*-old\.[^/]+$/i
];

function assertExists(targetPath, message) {
  if (!existsSync(targetPath)) {
    throw new Error(message);
  }
}

function scanDeployDirectory(currentDir, violations = []) {
  for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, fullPath).replaceAll(path.sep, "/");
    const lowerName = entry.name.toLowerCase();

    if (forbiddenNames.has(lowerName) || forbiddenPatterns.some((pattern) => pattern.test(relativePath))) {
      violations.push(relativePath);
    }

    if (entry.isDirectory()) {
      scanDeployDirectory(fullPath, violations);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (forbiddenExtensions.has(extension)) {
      violations.push(relativePath);
    }
  }

  return violations;
}

assertExists(workerSource, "Missing Worker source at src/worker/index.js.");
assertExists(staticDir, "Missing production static directory at deploy/static.");
assertExists(path.join(staticDir, "index.html"), "Missing deploy/static/index.html.");
assertExists(path.join(staticDir, "404.html"), "Missing deploy/static/404.html.");
assertExists(path.join(staticDir, "robots.txt"), "Missing deploy/static/robots.txt.");
assertExists(path.join(staticDir, "sitemap.xml"), "Missing deploy/static/sitemap.xml.");

mkdirSync(workerOutputDir, { recursive: true });
const source = readFileSync(workerSource, "utf8");
writeFileSync(workerOutput, source);

const violations = scanDeployDirectory(path.join(rootDir, "deploy"));
if (violations.length > 0) {
  throw new Error(`Forbidden files found in deploy:\n${violations.join("\n")}`);
}

const workerStats = statSync(workerOutput);
if (workerStats.size === 0) {
  throw new Error("Generated deploy/worker/index.js is empty.");
}

console.log("deploy/worker/index.js refreshed and deploy tree validated.");
