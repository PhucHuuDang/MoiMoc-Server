import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { is } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { activityUser } from "src/drizzle/schema/activity-user.schema";
import { user } from "src/drizzle/schema/user.schema";
import { DrizzleDbType } from "types/drizzle";

@Injectable()
export class ActivityService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async userActivities(userId: number) {
    try {
      const isExistUser = await this.db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
      });

      if (!isExistUser) {
        throw new NotFoundException("User not found");
      }

      const activities = await this.db.query.activityUser.findMany({
        where: (activityUser, { eq }) => eq(activityUser.userId, userId),
        orderBy: (activityUser, { asc }) => [asc(activityUser.createdAt)],
      });

      return activities;
    } catch (error) {
      console.log({ error });

      throw new InternalServerErrorException("Error fetching user activities");
    }
  }
}
