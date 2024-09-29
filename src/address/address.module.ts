import { Module } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [DrizzleModule],
  exports: [AddressService],
})
export class AddressModule {}
