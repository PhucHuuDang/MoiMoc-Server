import { Module } from "@nestjs/common";
import { ManageOrdersService } from "./manage-orders.service";
import { ManageOrdersController } from "./manage-orders.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [ManageOrdersController],
  providers: [ManageOrdersService],
  imports: [DrizzleModule],
})
export class ManageOrdersModule {}
