import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import type { Env } from '../core-utils';
export const getDb = (c: { env: Env }) => {
  if (!c.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const sql = neon(c.env.DATABASE_URL);
  return drizzle(sql, { schema });
};