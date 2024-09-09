import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleService {
  async getAll() {
    return 'Hello World!';
  }
}
