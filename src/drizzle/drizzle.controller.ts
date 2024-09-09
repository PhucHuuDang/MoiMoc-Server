import { Controller, Get } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

@Controller('drizzle')
export class DrizzleController {
  constructor(private readonly drizzleService: DrizzleService) {}

  @Get()
  async getAll() {
    return this.drizzleService.getAll();
  }
}
