import { Module } from "@nestjs/common";
import { DeliveryMethodsService } from "./delivery-methods.service";
import { DeliveryMethodsController } from "./delivery-methods.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [DeliveryMethodsController],
  providers: [DeliveryMethodsService],

  imports: [DrizzleModule],
})
export class DeliveryMethodsModule {}
