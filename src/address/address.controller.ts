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
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { InsertAddressProps } from "src/drizzle/schema/address.schema";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: InsertAddressProps) {
    return this.addressService.create(createAddressDto);
  }

  @Get("/user/:userId")
  findAll(@Param("userId") userId: string) {
    if (!userId) {
      throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
    }

    return this.addressService.findAll(+userId);
  }

  @Get(":addressId")
  findDetailAddress(@Param("addressId") addressId: string) {
    console.log({ addressId });
    if (!addressId) {
      throw new HttpException(
        "addressId ID is required",
        HttpStatus.BAD_REQUEST
      );
    }
    return this.addressService.detailAddress(+addressId);
  }

  @Put(":addressId")
  updateAddress(
    @Param("addressId") addressId: string,
    @Body() updateAddressValues: InsertAddressProps
  ) {
    return this.addressService.updateAddress(+addressId, updateAddressValues);
  }

  @Delete(":commentId")
  deleteAddress(@Param("commentId") commentId: string) {
    return this.addressService.deleteAddress(+commentId);
  }
}
