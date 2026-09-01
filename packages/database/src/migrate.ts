import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createDatabasePool } from "./index";

async function runMigrations() {
  const pool = createDatabasePool();
  const schemaPath = resolve(__dirname, "../../../docs/database/schema.sql");
  console.log(`[Database] Reading schema from: ${schemaPath}`);

  try {
    const sql = readFileSync(schemaPath, "utf-8");
    console.log("[Database] Executing schema migrations...");
    await pool.query(sql);
    console.log("[Database] ✅ Migrations completed successfully!");
  } catch (error) {
    console.error("[Database] ❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (import.meta.main) {
  runMigrations();
}
