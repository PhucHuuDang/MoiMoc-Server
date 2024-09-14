ALTER TABLE "orderDetail" ADD COLUMN "productId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
