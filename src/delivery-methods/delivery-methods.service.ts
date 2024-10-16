import { HttpException, Inject, Injectable } from "@nestjs/common";
import { CreateDeliveryMethodDto } from "./dto/create-delivery-method.dto";
import { UpdateDeliveryMethodDto } from "./dto/update-delivery-method.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  DeliveryInsertTypes,
  delivery,
} from "src/drizzle/schema/delivery-method.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class DeliveryMethodsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createDeliveryMethod(deliveryValues: DeliveryInsertTypes) {
    try {
      const newDeliveryMethod = await this.db
        .insert(delivery)
        .values(deliveryValues)
        .returning();

      return {
        message: `Created ${newDeliveryMethod[0].method} successfully`,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async findAllDeliveryMethods() {
    try {
      const deliveryMethods = await this.db.query.delivery.findMany();

      return deliveryMethods;
    } catch (error) {
      console.log({ error });
    }
  }

  findOneDeliveryMethod(deliveryId: number) {
    return `This action returns a #${deliveryId} deliveryMethod`;
  }

  async updateStatusDeliveryMethod(deliveryId: number, isActive: boolean) {
    const isExistDelivery = await this.db
      .select()
      .from(delivery)
      .where(eq(delivery.id, deliveryId));

    if (!isExistDelivery[0]) {
      return {
        message: "Delivery method not found",
      };
    }

    try {
      const updatedDeliveryMethod = await this.db
        .update(delivery)
        .set({ isActive } as Partial<DeliveryInsertTypes>) // Active is recognized as boolean here
        .where(eq(delivery.id, deliveryId))
        .returning();

      return {
        message: `Updated status ${updatedDeliveryMethod[0].method} successfully`,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async updateInfoDeliveryMethod(
    deliveryId: number,
    updateDeliveryMethodValues: DeliveryInsertTypes
  ) {
    const { method, price, estimatedDays } = updateDeliveryMethodValues;

    if (!method || !price || !estimatedDays) {
      throw new HttpException(
        "Missing required fields when update delivery",
        400
      );
    }

    const isExistDelivery = await this.db
      .select()
      .from(delivery)
      .where(eq(delivery.id, deliveryId));

    if (!isExistDelivery) {
      return {
        message: "Delivery method not found",
      };
    }

    try {
      const updateInfoDelivery = await this.db
        .update(delivery)
        .set({
          method,
          price,
          estimatedDays,
        })
        .where(eq(delivery.id, deliveryId))
        .returning();

      return {
        message: `Updated info ${updateInfoDelivery[0].method} successfully`,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async removeDeliveryMethod(deliveryId: number) {
    const isExistDelivery = await this.db
      .select()
      .from(delivery)
      .where(eq(delivery.id, deliveryId));

    if (!isExistDelivery) {
      return {
        message: "Delivery method not found",
      };
    }

    try {
      const deleteDeliveryMethod = await this.db
        .delete(delivery)
        .where(eq(delivery.id, deliveryId))
        .returning();

      return {
        message: `Deleted ${deleteDeliveryMethod[0].method} successfully`,
      };
    } catch (error) {
      console.log({ error });
    }
  }
}
