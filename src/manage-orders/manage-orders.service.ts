import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { orderDetailSchema } from "src/drizzle/schema/order-detail.schema";
import { usersOrders } from "src/drizzle/schema/users-orders.schema";
import { DrizzleDbType } from "types/drizzle";

@Injectable()
export class ManageOrdersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async userOrders(userId: number) {
    const isExistUser = await this.db.query.user.findFirst({
      where: (user) => eq(user.id, userId),
    });

    if (!isExistUser) {
      throw new Error("User not found");
    }

    try {
      const userOrders = await this.db.query.usersOrders.findMany({
        where: (usersOrders) => eq(usersOrders.userId, userId),
        with: {
          orderDetail: {
            with: {
              orderProducts: {
                with: {
                  product: {
                    with: {
                      productImages: {
                        limit: 1,
                      },
                    },
                  },
                },
              },
              deliveryMethod: true,
              paymentMethod: true,
            },
          },
        },
      });
      return userOrders;
    } catch (error) {
      console.log({ error });
      throw new Error("Error while fetching user orders");
    }
  }
}
