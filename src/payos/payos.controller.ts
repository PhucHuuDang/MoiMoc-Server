import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  Res,
} from "@nestjs/common";
import { PayosService } from "./payos.service";

const PayOS = require("@payos/node");
import { OrderValuesType } from "src/payments/stripe/types/stripe-types";

@Controller("payos")
export class PayosController {
  private payOs = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
  );
  constructor(private readonly payosService: PayosService) {}

  @Post("/payment")
  async createPayment(
    @Body() checkoutValues: OrderValuesType,
    @Req() req: any
  ) {
    // const userId = req.user.id;
    const userId = 1;
    console.log(req.user);
    const { user, address, phone, method, paymentMethod, products } =
      checkoutValues;

    if (
      !user ||
      !address ||
      !phone ||
      !method ||
      !paymentMethod ||
      !products ||
      !userId
    ) {
      throw new HttpException("Product values are required", 400);
    }

    console.log({ checkoutValues });
    const paymentLink =
      await this.payosService.createLinkPayment(checkoutValues);

    return { paymentUrl: paymentLink };
  }

  //* https://1051-116-110-43-211.ngrok-free.app/payos/receive-hook
  @Post("/receive-hook")
  async webhookData(@Req() req: any, @Res() res: any) {
    console.log("Received webhook data:", req); // Kiểm tra nội dung req.body

    console.log(req.body);
    const webhookData = this.payOs.verifyPaymentWebhookData(req.body);
    console.log({ webhookData });

    const paymentLinkInformation = await this.payOs.getPaymentLinkInformation(
      webhookData.paymentLinkId
    );

    console.log({ paymentLinkInformation });

    // const result = await this.payOs.confirmWebhook(webhookUrl.toString());
    // console.log({ result });
    // try {
    //   const webhookData = await this.payOs.verifyPaymentWebhookData(req.body); // Kiểm tra lỗi ở đây
    //   console.log({ webhookData });

    //   return res.status(200).json({ success: true, data: webhookData });
    // } catch (error) {
    //   console.error("Error processing webhook:", error);
    //   return res.status(500).json({ success: false, message: error.message });
    // }
  }

  @Get()
  async getPaymentId() {
    const paymentLink = await this.payOs.getPaymentLinkInformation("618375");

    console.log({ paymentLink });

    return paymentLink;
  }

  // a6049a9dc17e41baba842b3fe779d329

  // @Post("/receive-hook")

  // @Post("/receive-hook")
  // async webhookData(@Req() req: any) {
  //   // Log toàn bộ request để kiểm tra thông tin nhận được
  //   console.log("Received webhook:", req.body);

  //   // Lấy phần chữ ký từ headers (nếu có)
  //   const signature = req.headers["x-payos-signature"];

  //   if (!signature) {
  //     throw new HttpException("Missing PayOS signature", 400);
  //   }

  //   // Xác minh webhook bằng chữ ký
  //   try {
  //     const isValid = this.payOs.verifyWebhook(req.body, signature);

  //     if (!isValid) {
  //       throw new HttpException("Invalid PayOS signature", 400);
  //     }

  //     // Xử lý webhook logic ở đây (ví dụ: cập nhật đơn hàng, trạng thái thanh toán...)
  //     console.log("Webhook is valid:", req.body);

  //     // Trả về status 200 để xác nhận đã nhận webhook thành công
  //     return { status: "Webhook received and verified" };
  //   } catch (error) {
  //     console.error("Webhook verification failed:", error);
  //     throw new HttpException("Webhook verification failed", 400);
  //   }
  // }
}

// body: {
//   code: '00',
//   desc: 'success',
//   data: {
//     orderCode: 123,
//     amount: 3000,
//     description: 'VQRIO123',
//     accountNumber: '12345678',
//     reference: 'TF230204212323',
//     transactionDateTime: '2023-02-04 18:25:00',
//     paymentLinkId: '124c33293c43417ab7879e14c8d9eb18',
//     code: '00',
//     desc: 'Thành công',
//     counterAccountBankId: '',
//     counterAccountBankName: '',
//     counterAccountName: '',
//     counterAccountNumber: '',
//     virtualAccountName: '',
//     virtualAccountNumber: '',
//     currency: 'VND'
//   },
//   signature: 'b35cb1c2fd1d9d59c0e50aa80be5d3bc473a75af048fdb6704cb1f8a8a18207b'
// },
