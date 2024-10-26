import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: ["log", "error", "warn"],
  });

  app.enableCors({
    origin: [
      process.env.LOCAL_DOMAIN,
      process.env.PRODUCTION_DOMAIN,
      process.env.MOIMOC_DOMAIN,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  app.use(
    "/stripe/webhook",
    bodyParser.raw({ type: "*/*" }) // Ensure raw body is passed for Stripe signature verification
  );

  // app.use("/stripe/webhook", bodyParser.raw({ type: "application/json" }));

  // Apply raw body parser specifically for the /stripe/webhook route
  // app.use(
  //   "/stripe/webhook",
  //   bodyParser.raw({ type: "application/json" }),
  //   (req, res, next) => {
  //     req.rawBody = req.body;
  //     next();
  //   }
  // )

  // const rawBodyBuffer = (req, res, buffer, encoding) => {
  //   if (!req.headers["stripe-signature"]) {
  //     return;
  //   }

  //   if (buffer && buffer.length) {
  //     req.rawBody = buffer.toString(encoding || "utf8");
  //   }
  // };

  // app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  // app.use(bodyParser.json({ verify: rawBodyBuffer }));

  await app.listen(3002);
}
bootstrap();
