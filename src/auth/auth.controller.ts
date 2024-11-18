import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./guards/local-auth/local-auth.guard";
import { RefreshAuthGuard } from "./guards/refresh-auth/refresh-auth.guard";
import { NewUser } from "src/drizzle/schema/user.schema";
import { JwtAuthGuard } from "./guards/jwt-auth/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() createUserValues: NewUser) {
    const { email, password, name, phoneNumber, phoneAuth } = createUserValues;

    if (!name || !phoneAuth || !password) {
      throw new HttpException(
        "You are missing some fields",
        HttpStatus.BAD_REQUEST
      );
    }

    const registerUser = this.authService.register(createUserValues);

    return registerUser;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  hashingData(@Request() req: any): Promise<{
    userId: number;
    token: string;
    refreshToken: string;
  } | void> {
    const result = this.authService.hashingData(req.user);

    return result;

    // return this.authService.login();
  }
  @UseGuards(JwtAuthGuard)
  @Put("change-password")
  async changePassword(@Request() req: any) {
    const userId = req.user.id;
    // console.log(req.body);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new BadRequestException("You are missing some fields");
    }

    return this.authService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user);
  }
}
