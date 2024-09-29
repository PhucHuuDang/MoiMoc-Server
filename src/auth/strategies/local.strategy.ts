import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "phoneAuth",
    });
  }

  // * this will be used by the LocalStrategy
  validate(phoneAuth: string, password: string) {
    //* this return will be append it to Request.user
    return this.authService.validateUser(phoneAuth, password);
  }
}
