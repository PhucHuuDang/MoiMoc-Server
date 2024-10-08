import { Module } from "@nestjs/common";
import { DiscussionService } from "./discussion.service";
import { DiscussionController } from "./discussion.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [DiscussionController],
  providers: [DiscussionService],
  imports: [DrizzleModule],
})
export class DiscussionModule {}
