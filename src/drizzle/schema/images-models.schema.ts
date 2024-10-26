import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { aboutMoiMocSchema } from "./about-moi-moc.schema";

export const imagesModelsSchema = pgTable("imagesModels", {
  id: serial("id").primaryKey().notNull(),
  imageUrl: text("imageUrl").notNull().notNull(),

  aboutMoiMocId: integer("aboutMoiMocId")
    .references(() => aboutMoiMocSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const imagesModelsRelations = relations(
  imagesModelsSchema,
  ({ one }) => ({
    aboutMoiMoc: one(aboutMoiMocSchema, {
      fields: [imagesModelsSchema.aboutMoiMocId],
      references: [aboutMoiMocSchema.id],
    }),
  })
);

export type ImagesModelsInsertTypes = typeof imagesModelsSchema.$inferInsert;
