ALTER TABLE "comment" ADD COLUMN "rating" numeric;--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "rating";