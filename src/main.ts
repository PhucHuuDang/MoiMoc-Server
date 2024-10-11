import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableCors({
    origin: [process.env.LOCAL_DOMAIN, process.env.PRODUCTION_DOMAIN],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  // Apply raw body parser specifically for the /stripe/webhook route
  // app.use(
  //   "/stripe/webhook",
  //   bodyParser.raw({ type: "application/json" }),
  //   (req, res, next) => {
  //     req.rawBody = req.body;
  //     next();
  //   }
  // );

  await app.listen(3002);
}
bootstrap();
