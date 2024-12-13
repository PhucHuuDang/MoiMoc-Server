import { Module } from '@nestjs/common';
import { ManagePaymentsService } from './manage-payments.service';
import { ManagePaymentsController } from './manage-payments.controller';
import { LemonSqueezyModule } from './lemon-squeezy/lemon-squeezy.module';

@Module({
  controllers: [ManagePaymentsController],
  providers: [ManagePaymentsService],
  imports: [LemonSqueezyModule],
})
export class ManagePaymentsModule {}
