DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('ADMIN', 'STAFF', 'MEMBER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "price" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "discountPrice" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "productId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "paymentMethod" ALTER COLUMN "price" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "deliveryMethod" ALTER COLUMN "price" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "custom" ALTER COLUMN "price" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "custom" ALTER COLUMN "price" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "custom" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'MEMBER';