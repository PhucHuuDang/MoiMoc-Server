CREATE TABLE IF NOT EXISTS "productTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "productType";