ALTER TABLE "product" RENAME COLUMN "product_name" TO "productName";--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "phone" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "phone";