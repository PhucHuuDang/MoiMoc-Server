import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response } from "express";
import * as bodyParser from "body-parser";

@Injectable()
// export class RawBodyMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: () => any) {
//     bodyParser.raw({ type: "*/*" })(req, res, next);
//   }
// }
export class RawBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.originalUrl === "/webhook") {
      bodyParser.raw({ type: "application/json" })(req, res, (err) => {
        if (err) {
          console.error("Error in raw body middleware:", err.message);
          return res.status(400).send("Invalid payload");
        }
        next();
      });
    } else {
      next();
    }
  }
}
