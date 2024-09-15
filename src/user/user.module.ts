import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { PhoneService } from 'src/phone/phone.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PhoneService],
  imports: [DrizzleModule],
})
export class UserModule {}
