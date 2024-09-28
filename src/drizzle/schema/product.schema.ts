import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  decimal,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { comment } from "./comment.schema";
import { orderDetailSchema } from "./order-detail.schema";
import { custom } from "./custom.schema";
import {
  InsertProductImagesProps,
  SelectProductImagesProps,
  UpdateProductImagesProps,
  productImages,
} from "./product-images.schema";
import { SelectProductTypeProps, productType } from "./product-type.schema";
import { orderProducts } from "./order-products";
import { feedback } from "./feedback.schema";
import { ingredients } from "./ingredients.schema";

export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productDescription: text("productDescription").notNull(),
  price: numeric("price", { precision: 15, scale: 0 }).notNull(),

  discountPrice: numeric("discountPrice", { precision: 15, scale: 0 }).default(
    undefined
  ),
  discountPercentage: numeric("discountPercentage").default(undefined),
  quantity: numeric("quantity").notNull(),
  usage: text("usage").notNull(),
  details: text("details").notNull(),

  productTypeId: integer("productTypeId")
    .references(() => productType.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull().defaultNow(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  productImages: many(productImages),
  productType: one(productType, {
    fields: [product.productTypeId],
    references: [productType.id],
  }),
  comments: many(comment),
  // orderDetail: one(orderDetailSchema),

  orderProducts: one(orderProducts),

  custom: many(custom),

  feedback: many(feedback),

  ingredients: many(ingredients),
}));

export const productZod = createInsertSchema(product);

export type ProductShapeType = InferInsertModel<typeof product>;

export type SelectProductProps = InferSelectModel<typeof product>;

export type AllProductProps = SelectProductProps & {
  productImages: SelectProductImagesProps[];
  productType: SelectProductTypeProps;
  comments: SelectProductProps[];
};

export type newProductProps = ProductShapeType & {
  discountPercentage?: number;
  discountPrice?: number;
} & {
  imageUrl: string[];
  productTypeId: number;
};
export type UpdateProductProps = ProductShapeType & {
  discountPercentage?: number;
  discountPrice?: number;
} & {
  images: UpdateProductImagesProps[];
  productTypeId: number;
};
