ALTER TABLE "user" DROP CONSTRAINT "user_comments_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "comments";