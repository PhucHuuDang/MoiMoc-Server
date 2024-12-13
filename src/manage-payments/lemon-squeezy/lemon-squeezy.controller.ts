import { Controller, Get } from "@nestjs/common";
import { LemonSqueezyService } from "./lemon-squeezy.service";

@Controller("lemon-squeezy")
export class LemonSqueezyController {
  constructor(private readonly lemonSqueezyService: LemonSqueezyService) {}

  @Get()
  async createLemonSqueezyAccount() {
    return this.lemonSqueezyService.createLemonSqueezyAccount();
  }
}
