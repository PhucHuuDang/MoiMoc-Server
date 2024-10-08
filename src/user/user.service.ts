import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DrizzleDbType } from "types/drizzle";
import { NewUser, UserSelectTypes, user } from "src/drizzle/schema/user.schema";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { phones } from "src/drizzle/schema/phones.schema";
import { PhoneService } from "src/phone/phone.service";
import { createId } from "@paralleldrive/cuid2";
import { AddressService } from "src/address/address.service";
import { comment } from "src/drizzle/schema/comment.schema";

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

      // const insertPhones = await this.db
      //   .insert(phones)
      //   .values({
      //     userId: userId,
      //     phone: phoneNumber,
      //   })
      //   .returning();

      // console.log({ insertPhones });

      // return {
      //   user: insertDataUser[0],
      //   phone: insertPhones,
      // };
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
    // return await this.db.select().from(user);
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
    const userDetail = await this.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        phoneAuth: user.phoneAuth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const phonesUser = await this.phoneService.findPhonesByUserId(userId);
    const addressUser = await this.addressService.findUserAddresses(userId);

    const userDetailWithInfo = {
      user: userDetail[0],
      phones: phonesUser,
      address: addressUser,
    };

    return userDetailWithInfo;
  }

  async findUserByPhoneAuth(phoneAuth: string): Promise<UserSelectTypes> {
    const getUserByPhoneAuth = await this.db
      .select()
      .from(user)
      .where(eq(user.phoneAuth, phoneAuth));

    return getUserByPhoneAuth[0];
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  async remove(userId: number) {
    return `This action removes a #${userId} user`;
  }
}
