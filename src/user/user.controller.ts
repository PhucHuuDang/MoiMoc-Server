import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NewUser } from "../drizzle/schema/user.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: NewUser) {
    console.log({ createUserDto });
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllUserWithInfo() {
    return this.userService.findAllUserWithInfo();
  }

  @Get(":userId")
  findUserDetail(@Param("userId") userId: string) {
    // const userId = req.user.id;

    return this.userService.findUserDetail(+userId);
  }

  @Put(":userId")
  updateUserInfo(@Param("userId") userId: number, @Body() updateUser: any) {
    return "This action updates a #${userId} user";
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() req: any) {
    const userId = req.user.id;

    return this.userService.remove(userId);
  }
}
