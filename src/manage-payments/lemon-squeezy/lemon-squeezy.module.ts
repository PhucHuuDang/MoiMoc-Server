import { Module } from "@nestjs/common";
import { LemonSqueezyService } from "./lemon-squeezy.service";
import { LemonSqueezyController } from "./lemon-squeezy.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [LemonSqueezyController],
  providers: [LemonSqueezyService],
  imports: [DrizzleModule],
})
export class LemonSqueezyModule {}
