ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "address" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "address" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "product" RENAME COLUMN "stock" TO "quantity";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "orderDetail" DROP CONSTRAINT "orderDetail_paymentHistoryId_paymentHistory_id_fk";
--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "orderDetailId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "productImages" ALTER COLUMN "productId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orderDetail" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orderDetail" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "paymentHistory" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_paymentHistoryId_paymentHistory_id_fk" FOREIGN KEY ("paymentHistoryId") REFERENCES "public"."paymentHistory"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
