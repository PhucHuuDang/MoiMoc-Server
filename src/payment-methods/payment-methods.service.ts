import { Inject, Injectable } from "@nestjs/common";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  PaymentMethodProps,
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
    const methods = await this.db.query.paymentMethod.findMany();

    if (!methods.length) {
      return {
        message: "No payment methods found",
      };
    }
    return methods;
  }

  async findOneMethod(methodId: number) {
    const method = await this.db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.id, methodId));

    return method[0];
  }

  async updateMethod(methodId: number, values: PaymentMethodProps) {
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
