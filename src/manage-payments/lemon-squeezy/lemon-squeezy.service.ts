import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";

import {
  getAuthenticatedUser,
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

@Injectable()
export class LemonSqueezyService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createLemonSqueezyAccount() {
    const apiKey = process.env.LEMON_SQUEZY_MOIMOC_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    lemonSqueezySetup({
      apiKey,
      onError: (error) => console.log({ error }),
    });

    const { data, statusCode, error } = await getAuthenticatedUser();

    const checkout = await createCheckout(storeId, 629924);

    console.log({ data, statusCode, error, checkout });

    return {
      data,
      statusCode,
      error,
      checkout,
    };
  }
}
