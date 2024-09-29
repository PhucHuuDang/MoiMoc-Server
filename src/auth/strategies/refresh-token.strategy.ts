import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { AuthJwtPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import refreshConfig from "../config/refresh.config";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor(
    private authService: AuthService,
    //* refresh-jwt
    @Inject(refreshConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshConfig>
  ) {
    super({
      //* expect the token to be passed in the Authorization header with the Bearer scheme
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguration.secret,
      ignoreExpiration: false,
      // passReqToCallback: true,
    });
  }

  validate(payload: AuthJwtPayload) {
    return payload.sub;
    // return {
    //   //* this return will be append it to Request.user
    //   phoneAuth: payload.sub.phoneAuth,
    // };
  }
}
