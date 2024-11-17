import { Inject, Injectable } from "@nestjs/common";
import { CreatePhoneDto } from "./dto/create-phone.dto";
import { UpdatePhoneDto } from "./dto/update-phone.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  PhoneInsertTypes,
  PhoneSelectTypes,
  phones,
} from "src/drizzle/schema/phones.schema";
import { and, eq } from "drizzle-orm";

@Injectable()
export class PhoneService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {
    // console.log('DRIZZLE injected:', this.db);
    // console.log({ DRIZZLE });
  }

  async addPhone(createPhoneDto: PhoneInsertTypes) {
    const addPhone = await this.db
      .insert(phones)
      .values(createPhoneDto)
      .returning();
    return {
      message: "Phone created successfully",
      phone: addPhone[0].phone,
    };
  }

  async findAllPhones() {
    const getAllPhones = await this.db.query.phones.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            phoneAuth: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return getAllPhones;
  }

  async findPhonesByUserId(userId: number): Promise<PhoneSelectTypes[]> {
    const userPhones = await this.db.query.phones.findMany({
      where: (phones, { eq }) => eq(phones.userId, userId),
      orderBy: (phones, { asc }) => [asc(phones.createdAt)],
    });

    return userPhones;
  }

  async findPhonesById(phoneId: number): Promise<PhoneSelectTypes[]> {
    const userPhones = await this.db
      .select()
      .from(phones)
      .where(eq(phones.id, phoneId));

    return userPhones;
  }

  async updatePhone(
    phoneId: number,
    updatePhoneValues: PhoneInsertTypes
  ): Promise<{ message: string; phone }> {
    const updating = await this.db
      .update(phones)
      .set(updatePhoneValues)
      .where(
        and(eq(phones.id, phoneId), eq(phones.userId, updatePhoneValues.userId))
      )
      .returning();

    return {
      message: "Phone updated successfully",
      phone: updating[0].phone,
    };
  }

  async deletePhone(phoneId: number) {
    const deletedPhone = await this.db
      .delete(phones)
      .where(and(eq(phones.id, phoneId)))
      .returning();
    return {
      message: `Deleted ${deletedPhone[0].phone} successfully`,
      phone: deletedPhone[0].phone,
    };
  }
}
