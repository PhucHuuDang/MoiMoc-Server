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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NewUser } from "../drizzle/schema/user.schema";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: NewUser) {
    console.log({ createUserDto });
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("phone")
  addPhoneToUser(@Req() req: any) {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!userId || !phone) {
      throw new HttpException(
        "User ID and phone are required",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.userService.addPhoneToUser(userId, phone);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllUserWithInfo() {
    return this.userService.findAllUserWithInfo();
  }

  @UseGuards(JwtAuthGuard)
  @Get("detail")
  findUserDetail(@Req() req: any) {
    const userId = req.user.id;

    return this.userService.findUserDetail(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  updateUserInfo(@Req() req: any) {
    const userId = req.user.id;
    const { name, email, address, website, bio, designation } = req.body;

    if (!userId) {
      throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
    }

    return this.userService.updateUserInfo(userId, {
      name,
      email,
      address,
      website,
      bio,
      designation,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put("avatar")
  async updateAvatarUser(@Req() req: any) {
    const userId = req.user.id;

    const body = req.body;

    const { avatar } = body;

    if (!userId) {
      throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
    }

    return await this.userService.updateAvatarUser(userId, avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() req: any) {
    const userId = req.user.id;

    return this.userService.remove(userId);
  }

  @Get(":userId/comments")
  findCommentByUserId(@Param("userId") userId: string) {
    const comments = this.userService.findCommentByUserId(+userId);

    return comments;
  }
}
