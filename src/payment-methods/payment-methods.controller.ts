import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Put,
} from "@nestjs/common";
import { PaymentMethodsService } from "./payment-methods.service";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { PaymentMethodProps } from "src/drizzle/schema/payment-method.schema";

@Controller("payment-methods")
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  createPaymentMethod(@Body() values: PaymentMethodProps) {
    const { method, price } = values;

    if (!method) {
      throw new HttpException("Method is required", 400);
    }

    return this.paymentMethodsService.createPaymentMethod(values);
  }

  @Get()
  getAllPaymentMethods() {
    return this.paymentMethodsService.getAllPaymentMethods();
  }

  @Get(":methodId")
  findOneMethod(@Param("methodId") methodId: string) {
    if (!methodId) {
      throw new HttpException("Method ID is required", 400);
    }

    return this.paymentMethodsService.findOneMethod(+methodId);
  }

  @Put(":methodId")
  updateMethod(
    @Param("methodId") methodId: string,
    @Body() values: PaymentMethodProps
  ) {
    if (!methodId) {
      throw new HttpException("Method ID is required", 400);
    }

    return this.paymentMethodsService.updateMethod(+methodId, values);
  }

  @Delete(":methodId")
  deleteMethod(@Param("methodId") methodId: string) {
    return this.paymentMethodsService.deleteMethod(+methodId);
  }
}
