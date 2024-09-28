import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { PhoneService } from "src/phone/phone.service";
import { AddressService } from "src/address/address.service";
import { AddressModule } from "src/address/address.module";
import { PhoneModule } from "src/phone/phone.module";

@Module({
  controllers: [UserController],
  providers: [UserService, PhoneService, AddressService],
  imports: [DrizzleModule, PhoneModule, AddressModule],
})
export class UserModule {}
