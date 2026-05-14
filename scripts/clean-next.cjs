const fs = require("fs/promises");
const path = require("path");

const TARGETS_BY_MODE = {
  all: [".next", ".next-dev"],
  build: [".next"],
  dev: [".next-dev"],
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function removeDirWithRetry(targetDir) {
  const maxAttempts = 6;
  const absoluteDir = path.resolve(process.cwd(), targetDir);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await fs.rm(absoluteDir, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 120,
      });
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`[clean:next] Failed to remove ${absoluteDir}: ${error?.message || error}`);
      }
      await wait(150 * attempt);
    }
  }
}

async function cleanNext() {
  const modeArg = (process.argv[2] || "all").toLowerCase();
  const targets = TARGETS_BY_MODE[modeArg];

  if (!targets) {
    throw new Error(`[clean:next] Unknown mode "${modeArg}". Use one of: all, build, dev`);
  }

  for (const target of targets) {
    await removeDirWithRetry(target);
  }
}

cleanNext().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
