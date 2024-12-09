// import { integer, pgTable, primaryKey, serial } from "drizzle-orm/pg-core";
// import { product } from "./product.schema";
// import { orderDetailSchema } from "./order-detail.schema";
// import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// export const orderProducts = pgTable(
//   "orderProducts",
//   {
//     // Foreign key to the orderDetail table
//     orderDetailId: integer("orderDetailId")
//       .notNull()
//       .references(() => orderDetailSchema.id, {
//         onDelete: "cascade",
//         onUpdate: "cascade",
//       }),

//     // Foreign key to the product table
//     productId: integer("productId")
//       .notNull()
//       .references(() => product.id, {
//         onDelete: "cascade",
//         onUpdate: "cascade",
//       }),

//     quantity: integer("quantity").notNull(), // Quantity of the product in this order
//   },
//   (table) => ({
//     pk: primaryKey({ columns: [table.orderDetailId, table.productId] }), // Composite primary key
//   })
// );

// export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
//   // Relation to the orderDetail table
//   orderDetail: one(orderDetailSchema, {
//     fields: [orderProducts.orderDetailId], // Foreign key in orderProducts
//     references: [orderDetailSchema.id], // Primary key in orderDetail
//   }),

//   // Relation to the product table
//   product: one(product, {
//     fields: [orderProducts.productId], // Foreign key in orderProducts
//     references: [product.id], // Primary key in product
//   }),
// }));

// export type OrderProductsValues = InferInsertModel<typeof orderProducts>;
// export type OrderProductSelectValues = InferSelectModel<typeof orderProducts>;
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { product } from "./product.schema";
import { orderDetailSchema } from "./order-detail.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const orderProducts = pgTable(
  "order_products",
  {
    // Foreign key to the orderDetail table
    orderDetailId: integer("orderDetailId")
      .notNull()
      .references(() => orderDetailSchema.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    // Foreign key to the product table
    productId: integer("productId")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    quantity: integer("quantity").notNull(), // Quantity of the product in this order
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderDetailId, table.productId] }), // Composite primary key
  })
);

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

export type OrderProductsInsert = InferInsertModel<typeof orderProducts>;
export type OrderProductSelectValues = InferSelectModel<typeof orderProducts>;
