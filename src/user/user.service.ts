import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DrizzleDbType } from "types/drizzle";
import {
  NewUser,
  UserInsertTypes,
  UserSelectTypes,
  user,
} from "src/drizzle/schema/user.schema";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { phones } from "src/drizzle/schema/phones.schema";
import { PhoneService } from "src/phone/phone.service";
import { createId } from "@paralleldrive/cuid2";
import { AddressService } from "src/address/address.service";
import { comment } from "src/drizzle/schema/comment.schema";
import { activityUser } from "src/drizzle/schema/activity-user.schema";

const saltOrRounds: number = 10;

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly phoneService: PhoneService,
    private readonly addressService: AddressService
  ) {
    // console.log('DRIZZLE injected:', this.db);
  }

  async createUser(createUserValues: NewUser) {
    try {
      console.log({ createUserValues });

      const { phoneNumber, email, name, password, phoneAuth } =
        createUserValues;

      const hashPassword = await bcrypt.hash(password, saltOrRounds);

      console.log({ hashPassword });

      const insertDataUser = await this.db
        .insert(user)
        .values({
          name,
          ...(email && { email }),
          phoneAuth,
          password: hashPassword,
        })
        .returning({ userId: user.id });

      console.log({ insertDataUser });

      const userId = insertDataUser[0].userId;

      return {
        user: insertDataUser[0].userId,
        message: "User created successfully",
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async addPhoneToUser(userId: number, phone: string) {
    const insertPhones = await this.db
      .insert(phones)
      .values({
        userId,
        phone,
      })
      .returning();

    return {
      message: "Added phone to user successfully",
      phone: insertPhones[0],
    };
  }

  async findAllUserWithInfo() {
    return this.db.query.user.findMany({
      with: {
        phones: true,
        address: true,
      },
    });
  }

  async findCommentByUserId(userId: number) {
    return await this.db
      .select({
        id: comment.id,
        content: comment.content,
        rating: comment.rating,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        // productId: comment.productId,
      })
      .from(comment)
      .where(eq(comment.userId, userId));
  }

  async findUserDetail(userId: number) {
    try {
      const isExistUser = await this.db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
      });

      const userDetail = await this.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          website: user.website,
          bio: user.bio,
          designation: user.designation,
          phoneAuth: user.phoneAuth,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      const phonesUser = await this.phoneService.findPhonesByUserId(userId);
      const addressUser = await this.addressService.findUserAddresses(userId);
      const activities = await this.db.query.activityUser.findMany({
        where: (activityUser, { eq }) => eq(activityUser.userId, userId),
        orderBy: (activityUser, { asc }) => [asc(activityUser.createdAt)],
      });

      const userDetailWithInfo = {
        user: userDetail[0],
        phones: phonesUser,
        address: addressUser,
        activities,
      };

      return userDetailWithInfo;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException("Error fetching user detail");
    }
  }

  async findUserByPhoneAuth(phoneAuth: string): Promise<UserSelectTypes> {
    const getUserByPhoneAuth = await this.db
      .select()
      .from(user)
      .where(eq(user.phoneAuth, phoneAuth));

    return getUserByPhoneAuth[0];
  }

  async updateUserInfo(
    userId: number,
    values: Omit<UserInsertTypes, "password" | "phoneAuth"> & {
      email?: string;
      website?: string | null;
      bio?: string | null;
      designation?: string | null;
      address?: string | null;
    }
  ) {
    const { name, email,  website, bio, address, designation } =
      values;

    try {
      const isExistUser = await this.db
        .select({
          userId: user.id,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      if (!isExistUser[0]) {
        throw new HttpException("User not found", 404);
      }

      const updateUserProfile = await this.db
        .update(user)
        .set({
          name,
          email,
          website,
          bio,
          designation,
        } as Partial<UserInsertTypes>)
        .where(eq(user.id, userId))
        .returning();

      const activity = await this.db
        .insert(activityUser)
        .values({
          userId,
          activity: `Bạn đã cập nhật thông tin cá nhân`,
        })
        .returning();

      return {
        message: `Profile updated successfully for user ${updateUserProfile[0].name}`,
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException("Error updating profile for user");
    }
  }

  async updateAvatarUser(userId: number, avatar: string) {
    try {
      const isExistUser = await this.db
        .select({
          userId: user.id,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      if (!isExistUser[0]) {
        throw new HttpException("User not found", 404);
      }

      const updateAvatar = await this.db
        .update(user)
        .set({
          avatar,
          updatedAt: new Date(),
        } as Partial<UserInsertTypes>)
        .where(eq(user.id, userId))
        .returning();

      if (updateAvatar[0].id) {
        await this.db
          .insert(activityUser)
          .values({
            userId: updateAvatar[0].id,
            activity: `Bạn đã cập nhật ảnh đại diện`,
          })
          .returning();
      }

      return {
        message: `Avatar updated successfully for user ${updateAvatar[0].name}`,
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException("Error updating avatar for user");
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  async remove(userId: number) {
    return `This action removes a #${userId} user`;
  }
}
