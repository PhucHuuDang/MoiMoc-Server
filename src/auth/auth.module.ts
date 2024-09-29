import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { PhoneModule } from "src/phone/phone.module";
import { AddressModule } from "src/address/address.module";
import { AddressService } from "src/address/address.service";
import { PhoneService } from "src/phone/phone.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PhoneService,
    AddressService,
    LocalStrategy,
    JwtStrategy,
  ],
  imports: [
    DrizzleModule,
    PhoneModule,
    UserModule,
    AddressModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
})
export class AuthModule {}
