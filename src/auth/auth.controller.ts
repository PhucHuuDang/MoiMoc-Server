import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./guards/local-auth/local-auth.guard";
import { RefreshAuthGuard } from "./guards/refresh-auth/refresh-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register() {
    return "";
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  hashingData(@Request() req: any): Promise<{
    userId: number;
    token: string;
    refreshToken: string;
  } | void> {
    console.log(req.body);
    console.log(req.user);

    const result = this.authService.hashingData(req.user);

    return result;

    // return this.authService.login();
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user);
  }
}
