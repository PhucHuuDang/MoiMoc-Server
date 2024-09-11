import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/drizzle/drizzle.module';

export const DRIZZLE = Symbol('drizzle-connection');

export type DrizzleDbType = NodePgDatabase<typeof DRIZZLE>;
