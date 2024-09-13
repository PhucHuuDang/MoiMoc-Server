import { NodePgDatabase } from 'drizzle-orm/node-postgres';
// import { DRIZZLE } from 'src/drizzle/drizzle.module';
import * as schema from '../src/drizzle/schema/schema';

export const DRIZZLE = Symbol('drizzle-connection');

export type DrizzleDbType = NodePgDatabase<typeof schema>;
