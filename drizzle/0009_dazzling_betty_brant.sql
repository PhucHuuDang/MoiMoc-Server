ALTER TABLE "product" ADD COLUMN "orderDetailId" integer DEFAULT null;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_orderDetailId_orderDetail_id_fk" FOREIGN KEY ("orderDetailId") REFERENCES "public"."orderDetail"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
