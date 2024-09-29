import * as bcrypt from "bcrypt";

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { UserService } from "src/user/user.service";
import { DrizzleDbType } from "types/drizzle";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtPayload } from "./types/auth-jwtPayload";
import { UserSelectTypes } from "src/drizzle/schema/user.schema";
import { ConfigType } from "@nestjs/config";
import refreshConfig from "./config/refresh.config";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>
  ) {
    console.log(refreshConfig.KEY); //*refresh-jwt
  }

  // * this will be used by the LocalStrategy
  async validateUser(phoneAuth: string, password: string) {
    const user = await this.userService.findUserByPhoneAuth(phoneAuth);

    if (!user) throw new UnauthorizedException("User not found");

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new UnauthorizedException("Password not match");

    return user;
  }

  async register() {
    return "";
  }

  async hashingData(userData: UserSelectTypes) {
    const payload: AuthJwtPayload = { sub: userData };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      payload,
      this.refreshConfiguration
    );

    //* we don't need to pass secret key here, it will be handled by the jwtConfig
    return {
      userId: userData.id,
      token,
      refreshToken,
    };
  }

  async refreshToken(userData: UserSelectTypes) {
    const payload: AuthJwtPayload = { sub: userData };

    const token = this.jwtService.sign(payload);

    return {
      userId: userData.id,
      token,
    };
  }
}
