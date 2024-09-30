import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { product } from "./product.schema";
import { orderDetailSchema } from "./order-detail.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// // Insert into orderDetailSchema
// const newOrderDetail = await db.insert(orderDetailSchema).values({
//   userId: someUserId,
//   paymentHistoryId: somePaymentHistoryId,
//   paymentMethodId: somePaymentMethodId,
// });

// // Insert multiple products into orderProducts
// const orderProductsData = products.map((product) => ({
//   orderDetailId: newOrderDetail.id,
//   productId: product.id,
//   quantity: product.quantity,
// }));

// await db.insert(orderProducts).values(orderProductsData);

export const orderProducts = pgTable("orderProducts", {
  id: serial("id").primaryKey(),

  // Foreign key to the orderDetail table
  orderDetailId: integer("orderDetailId")
    .notNull()
    .references(() => orderDetailSchema.id, { onDelete: "cascade" }),

  // Foreign key to the product table
  productId: integer("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

  quantity: integer("quantity").notNull(), // Quantity of the product in this order
});

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
  // Relation to the orderDetail table
  orderDetail: one(orderDetailSchema, {
    fields: [orderProducts.orderDetailId], // Foreign key in orderProducts
    references: [orderDetailSchema.id], // Primary key in orderDetail
  }),

  // Relation to the product table
  product: one(product, {
    fields: [orderProducts.productId], // Foreign key in orderProducts
    references: [product.id], // Primary key in product
  }),
}));

export type InsertOrderProductsProps = InferInsertModel<typeof orderProducts>;
export type OrderProductSelectValues = InferSelectModel<typeof orderProducts>;
