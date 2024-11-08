import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrchestrationResult,
  OrderStatus,
  requireAuth,
} from "@daticketslearning/common";
import { validateCreateCharge } from "../middleware/validate-request";
import { Order } from "../model/order";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments/create-payment-intent",
  requireAuth,
  validateCreateCharge,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
      },
    });

    OrchestrationResult.item(
      res,
      {
        clientSecret: paymentIntent.client_secret,
        // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
        // dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      },
      201
    );
  }
);

export { router as createChargeRouter };
