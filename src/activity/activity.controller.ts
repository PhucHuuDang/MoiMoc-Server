import {
  BadRequestException,
  Controller,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";

@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserActivities(@Request() req: any) {
    const userId = req.user.id;

    if (!userId) {
      throw new BadRequestException("User ID is required");
    }

    return this.activityService.userActivities(userId);
  }
}
