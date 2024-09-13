import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [DrizzleModule, ConfigModule.forRoot({ isGlobal: true }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
