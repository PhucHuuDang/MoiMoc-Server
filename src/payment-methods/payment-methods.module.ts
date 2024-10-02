import { Module } from "@nestjs/common";
import { PaymentMethodsService } from "./payment-methods.service";
import { PaymentMethodsController } from "./payment-methods.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
