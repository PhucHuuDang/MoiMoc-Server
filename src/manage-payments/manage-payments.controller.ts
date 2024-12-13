import { Controller } from '@nestjs/common';
import { ManagePaymentsService } from './manage-payments.service';

@Controller('manage-payments')
export class ManagePaymentsController {
  constructor(private readonly managePaymentsService: ManagePaymentsService) {}
}
