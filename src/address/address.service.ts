import { Inject, Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {} from "src/drizzle/schema/comment.schema";
import { InsertAddressProps, address } from "src/drizzle/schema/address.schema";
import { and, eq } from "drizzle-orm";

@Injectable()
export class AddressService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async create(addAddressValues: InsertAddressProps) {
    const newAddress = await this.db
      .insert(address)
      .values(addAddressValues)
      .returning();

    return {
      message: "Address created successfully",
      address: newAddress[0].address,
    };
  }

  async findUserAddresses(userId: number) {
    const addresses = await this.db.query.address.findMany({
      where: (address, { eq }) => eq(address.userId, userId),
      orderBy: (address, { asc }) => [asc(address.createdAat)],
    });

    return addresses;
  }

  async detailAddress(addressId: number) {
    console.log({ addressId });
    const addressDetail = await this.db
      .select()
      .from(address)
      .where(eq(address.id, addressId));

    console.log(addressDetail);

    return addressDetail;
  }

  async updateAddress(
    addressId: number,
    updateAddressValues: InsertAddressProps
  ) {
    console.log({ first: addressId, second: updateAddressValues });
    const updatedAddress = await this.db
      .update(address)
      .set(updateAddressValues)
      .where(
        and(
          eq(address.id, addressId),
          eq(address.userId, updateAddressValues.userId)
        )
      )
      .returning();

    return {
      message: "Address updated successfully",
      updatedAddress: updatedAddress[0].address,
    };
  }

  deleteAddress(commentId: number) {
    const deletedAddress = this.db
      .delete(address)
      .where(eq(address.id, commentId))
      .execute();
  }
}
