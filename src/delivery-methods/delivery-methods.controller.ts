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
import { DeliveryMethodsService } from "./delivery-methods.service";
import { CreateDeliveryMethodDto } from "./dto/create-delivery-method.dto";
import { UpdateDeliveryMethodDto } from "./dto/update-delivery-method.dto";
import { DeliveryInsertTypes } from "src/drizzle/schema/delivery-method.schema";

@Controller("delivery-methods")
export class DeliveryMethodsController {
  constructor(
    private readonly deliveryMethodsService: DeliveryMethodsService
  ) {}

  @Post()
  createDeliveryMethod(@Body() deliveryValues: DeliveryInsertTypes) {
    const { method, price, estimatedDays } = deliveryValues;

    if (!method || !price || !estimatedDays) {
      throw new HttpException(
        "Missing required fields when creating delivery",
        400
      );
    }

    const newDeliveryMethod =
      this.deliveryMethodsService.createDeliveryMethod(deliveryValues);

    return newDeliveryMethod;
  }

  @Get()
  findAllDeliveryMethods() {
    return this.deliveryMethodsService.findAllDeliveryMethods();
  }

  @Get(":deliveryId")
  findOne(@Param("deliveryId") deliveryId: string) {
    // return this.deliveryMethodsService.find(+deliveryId);
  }

  @Put("/active/:deliveryId")
  updateStatus(
    @Param("deliveryId") deliveryId: string,
    @Body() isActive: boolean
  ) {
    return this.deliveryMethodsService.updateStatusDeliveryMethod(
      +deliveryId,
      isActive
    );
  }

  @Put(":deliveryId")
  updateInfo(
    @Param("deliveryId") deliveryId: string,
    @Body() updateDeliveryMethodValues: DeliveryInsertTypes
  ) {
    const { method, price, estimatedDays } = updateDeliveryMethodValues;

    if (!method || !price || !estimatedDays) {
      throw new HttpException(
        "Missing required fields when update delivery",
        400
      );
    }

    return this.deliveryMethodsService.updateInfoDeliveryMethod(
      +deliveryId,
      updateDeliveryMethodValues
    );
  }

  @Delete(":deliveryId")
  removeDeliveryMethod(@Param("deliveryId") deliveryId: string) {
    if (!deliveryId) {
      throw new HttpException("Missing deliveryId", 400);
    }

    return this.deliveryMethodsService.removeDeliveryMethod(+deliveryId);
  }
}
