import { serial, text } from "drizzle-orm/pg-core";

export const user = {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique()
}