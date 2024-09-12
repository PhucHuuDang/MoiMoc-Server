CREATE TABLE IF NOT EXISTS "paymentMethod" (
	"id" serial PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"price" numeric NOT NULL,
	"orderDetailId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deliveryMethod" (
	"id" serial PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"price" numeric NOT NULL,
	"orderDetailId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paymentHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderDetailId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom" (
	"id" serial PRIMARY KEY NOT NULL,
	"options" text NOT NULL,
	"price" numeric DEFAULT '0',
	"productId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"imageUrl" text NOT NULL,
	"productId" integer
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "comments" integer;--> statement-breakpoint
ALTER TABLE "orderDetail" ADD COLUMN "paymentHistoryId" integer;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "productId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paymentMethod" ADD CONSTRAINT "paymentMethod_orderDetailId_orderDetail_id_fk" FOREIGN KEY ("orderDetailId") REFERENCES "public"."orderDetail"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deliveryMethod" ADD CONSTRAINT "deliveryMethod_orderDetailId_orderDetail_id_fk" FOREIGN KEY ("orderDetailId") REFERENCES "public"."orderDetail"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom" ADD CONSTRAINT "custom_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productImages" ADD CONSTRAINT "productImages_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_comments_user_id_fk" FOREIGN KEY ("comments") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_paymentHistoryId_paymentHistory_id_fk" FOREIGN KEY ("paymentHistoryId") REFERENCES "public"."paymentHistory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
