import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleController } from './drizzle.controller';
import { DrizzleService } from './drizzle.service';

import * as schema from './schema/schema';
export const DRIZZLE = Symbol('drizzle-connection');
// export const DRIZZLE = 'DRIZZLE_CONNECTION';
// import { DRIZZLE } from 'types/drizzle';

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

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
    DrizzleService,
  ],
  controllers: [DrizzleController],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
