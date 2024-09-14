ALTER TABLE "phone" DROP CONSTRAINT "phone_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone" ADD CONSTRAINT "phone_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
