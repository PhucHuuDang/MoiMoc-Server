import { Injectable } from "@nestjs/common";

// import { PayOS } from "@payos/node";
const PayOS = require("@payos/node");

import { createId } from "@paralleldrive/cuid2";
import { OrderValuesType } from "src/payments/stripe/types/stripe-types";

@Injectable()
export class PayosService {
  private payOs = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
  );
  async createLinkPayment(checkoutValues: OrderValuesType) {
    const amount = checkoutValues.products.reduce((acc, product) => {
      return (
        acc +
        (product.discountPrice
          ? Number(product.discountPrice)
          : Number(product.price))
      );
    }, 0);

    const items = checkoutValues.products.map((product) => {
      return {
        name: product.productName,
        price: product.discountPrice
          ? Number(product.discountPrice)
          : Number(product.price),
        quantity: product.quantityOrder,
      };
    });

    const body = {
      orderCode: Number(String(Date.now()).slice(-6)),
      description: "Payment for products",
      amount,
      items,
      buyerName: checkoutValues.user.name,
      buyerEmail: checkoutValues.user.email,
      buyerPhone: checkoutValues.phone,
      buyerAddress: checkoutValues.address,
      returnUrl: "https://moi-moc-client.vercel.app/success",
      cancelUrl: "https://moi-moc-client.vercel.app/cancel",
    };

    try {
      const paymentLink = await this.payOs.createPaymentLink(body);

      return paymentLink.checkoutUrl;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all payos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payo`;
  }

  remove(id: number) {
    return `This action removes a #${id} payo`;
  }
}
