#!/usr/bin/env node
import("../index.mjs").catch((err) => {
  console.error("Error starting REPL:", err);
  process.exit(1);
});
