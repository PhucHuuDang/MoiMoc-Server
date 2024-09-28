import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NewUser } from "../drizzle/schema/user.schema";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: NewUser) {
    console.log({ createUserDto });
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAllUserWithInfo() {
    return this.userService.findAllUserWithInfo();
  }

  @Get(":userId")
  findUserDetail(@Param("userId") userId: string) {
    return this.userService.findUserDetail(+userId);
  }

  @Put(":userId")
  updateUserInfo(@Param("userId") userId: number, @Body() updateUser: any) {
    return "This action updates a #${userId} user";
  }

  @Delete(":userId")
  remove(@Param("userId") userId: string) {
    return this.userService.remove(+userId);
  }
}
