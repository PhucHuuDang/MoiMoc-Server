ALTER TABLE "product" ADD COLUMN "productTypeId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_productTypeId_productType_id_fk" FOREIGN KEY ("productTypeId") REFERENCES "public"."productType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
