import {
  BadRequestException,
  Controller,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ManageOrdersService } from "./manage-orders.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";

@Controller("manage-orders")
export class ManageOrdersController {
  constructor(private readonly manageOrdersService: ManageOrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("user-orders")
  async userOrders(@Request() req: any) {
    const userId = req.user.id;

    if (!userId) {
      throw new BadRequestException("Lack of user id");
    }

    return this.manageOrdersService.userOrders(+userId);
  }
}
