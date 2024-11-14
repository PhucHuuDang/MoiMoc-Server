import { Module } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [DrizzleModule],
})
export class ActivityModule {}
