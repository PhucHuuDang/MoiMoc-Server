import { HttpException, Inject, Injectable } from "@nestjs/common";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  PaymentMethodProps,
  PaymentSelectValues,
  paymentMethod,
} from "src/drizzle/schema/payment-method.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class PaymentMethodsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createPaymentMethod(
    values: PaymentMethodProps
  ): Promise<{ message: string; method: string }> {
    const method = await this.db
      .insert(paymentMethod)
      .values(values)
      .returning();

    return {
      message: `Payment ${method[0].method} method created successfully`,
      method: method[0].method,
    };
  }

  async getAllPaymentMethods() {
    try {
      const methods = await this.db.query.paymentMethod.findMany();

      return methods;
    } catch (error) {
      console.log({ error });
      throw new HttpException("Error finding all payment methods", 400);
    }
  }

  async findOneMethod(methodId: number) {
    const method = this.db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.id, methodId))
      .prepare("method");

    const result = await method.execute({ methodId });

    if (!result[0]) {
      throw new HttpException("Payment method not found", 400);
    }

    return result[0];
  }

  async updateMethod(methodId: number, values: PaymentMethodProps) {
    const isExistMethod = await this.db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.id, methodId));

    if (!isExistMethod[0]) {
      throw new HttpException("Payment method not found", 400);
    }

    const updateMethod = await this.db
      .update(paymentMethod)
      .set(values)
      .where(eq(paymentMethod.id, methodId))
      .returning();

    return {
      message: `Payment method #${methodId} updated successfully`,
      method: updateMethod[0].method,
    };
  }

  async updateStatusMethod(methodId: number, status: boolean) {
    const isExistMethod = await this.db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.id, methodId));

    if (!isExistMethod[0]) {
      throw new HttpException("Payment method not found", 400);
    }

    try {
      const updateStatusPayment = await this.db
        .update(paymentMethod)
        .set({
          status,
        } as Partial<PaymentMethodProps>)
        .where(eq(paymentMethod.id, methodId))
        .returning();

      return {
        message: `Updated status of ${updateStatusPayment[0].method} successfully`,
      };
    } catch (error) {
      console.log({ error });
      throw new HttpException("Error updating payment method status", 400);
    }
  }

  async deleteMethod(methodId: number) {
    const deleteMethod = await this.db
      .delete(paymentMethod)
      .where(eq(paymentMethod.id, methodId))
      .returning();

    return {
      message: `Payment method #${methodId} deleted successfully`,
      method: deleteMethod[0].method,
    };
  }
}
