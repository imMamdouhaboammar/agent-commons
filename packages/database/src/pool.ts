import { Pool } from "pg";

export function createDatabasePool(connectionString?: string): Pool {
  return new Pool({
    connectionString: connectionString || process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/agent_commons",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });
}
