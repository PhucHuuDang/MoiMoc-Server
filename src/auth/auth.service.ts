import * as bcrypt from "bcrypt";

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { UserService } from "src/user/user.service";
import { DrizzleDbType } from "types/drizzle";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtPayload } from "./types/auth-jwtPayload";
import { UserSelectTypes } from "src/drizzle/schema/user.schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  // * this will be used by the LocalStrategy
  async validateUser(phoneAuth: string, password: string) {
    const user = await this.userService.findUserByPhoneAuth(phoneAuth);

    if (!user) throw new UnauthorizedException("User not found");

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new UnauthorizedException("Password not match");

    // return {
    //   id: user.id,
    //   role: user.role,
    // };

    return user;
  }

  async register() {
    return "";
  }

  async hashingData(userData: UserSelectTypes) {
    const payload: AuthJwtPayload = { sub: userData };

    //* we don't need to pass secret key here, it will be handled by the jwtConfig
    return { assessToken: this.jwtService.sign(payload) };
  }
}
