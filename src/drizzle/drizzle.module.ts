import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleController } from './drizzle.controller';
import { DrizzleService } from './drizzle.service';

import * as schema from './schema/schema';
// import { DRIZZLE } from 'types/drizzle';
export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseURL = configService.get<string>('DATABASE_URL');

        const pool = new Pool({
          connectionString: databaseURL,
          // ssl: true,
          ssl: { rejectUnauthorized: false },
        });

        drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
    DrizzleService,
  ],
  controllers: [DrizzleController],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
