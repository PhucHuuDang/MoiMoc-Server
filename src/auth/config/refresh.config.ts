import { registerAs } from "@nestjs/config";
import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";

export default registerAs(
  "refresh-jwt",
  (): JwtSignOptions => ({
    secret: process.env.Refresh_JWT_SECRET,
    expiresIn: process.env.Refresh_JWT_EXPIRES_IN,
  })
);
