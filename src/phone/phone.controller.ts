import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { PhoneInsertTypes } from "src/drizzle/schema/phones.schema";

@Controller("phone")
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  addPhone(@Body() createPhoneValues: PhoneInsertTypes) {
    const { phone, userId } = createPhoneValues;

    if (!phone || !userId) {
      throw new HttpException(
        "Phone and User ID are required",
        HttpStatus.BAD_REQUEST
      );
    }

    console.log({ createPhoneValues });
    return this.phoneService.addPhone(createPhoneValues);
  }

  @Get()
  findAllPhones() {
    return this.phoneService.findAllPhones();
  }

  @Get(":phoneId")
  findPhonesById(@Param("phoneId") phoneId: string) {
    return this.phoneService.findPhonesById(+phoneId);
  }
  @Get("/user/:userId")
  findPhonesByUserId(@Param("userId") userId: string) {
    return this.phoneService.findPhonesByUserId(+userId);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updatePhoneDto: PhoneInsertTypes) {
    const { phone, userId } = updatePhoneDto;

    if (!phone || !userId) {
      throw new HttpException(
        "Phone and User ID are required",
        HttpStatus.BAD_REQUEST
      );
    }

    const updatedPhone = this.phoneService.updatePhone(+id, updatePhoneDto);
    return updatedPhone;
  }

  @Delete(":id")
  PhoneInsertTypes(@Param("id") id: string) {
    const deletedPhone = this.phoneService.deletePhone(+id);
    return deletedPhone;
  }
}
