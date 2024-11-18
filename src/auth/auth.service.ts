import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { UserService } from "src/user/user.service";
import { DrizzleDbType } from "types/drizzle";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtPayload } from "./types/auth-jwtPayload";
import { NewUser, UserSelectTypes, user } from "src/drizzle/schema/user.schema";
import { ConfigType } from "@nestjs/config";
import refreshConfig from "./config/refresh.config";
import { activityUser } from "src/drizzle/schema/activity-user.schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>
  ) {
    //console.log(refreshConfig.KEY); //*refresh-jwt
  }

  // * this will be used by the LocalStrategy
  async validateUser(phoneAuth: string, password: string) {
    const user = await this.userService.findUserByPhoneAuth(phoneAuth);

    if (!user) throw new UnauthorizedException("User not found");

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new UnauthorizedException("Password not match");

    return user;
  }

  async register(createUserValues: NewUser) {
    const registerUser = await this.userService.createUser(createUserValues);

    return registerUser;
  }

  async changePassword(userId: number, currentPassword: string, newPassword) {
    const isExistUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    if (!isExistUser) throw new NotFoundException("User not found");

    try {
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        isExistUser.password
      );

      if (!isPasswordMatch) {
        throw new NotFoundException("Password not match");
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);

      // console.log({ hashPassword });

      const updatedPassword = await this.db
        .update(user)
        .set({
          password: hashPassword,
        })
        .where(eq(user.id, userId))
        .returning({ userId: user.id, name: user.name });

      if (updatedPassword[0].userId) {
        await this.db.insert(activityUser).values({
          userId,
          activity: "Bạn đã thay đổi mật khẩu thành công",
        });
      }

      return {
        message: "Password changed successfully",
      };
    } catch (error) {
      console.log({ error });
      // throw new InternalServerErrorException("Failed to change password");
      throw new Error(error);
    }

    // const isMatchPass =
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
