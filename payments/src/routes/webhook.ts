import express, { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../stripe";
import { Payment } from "../model/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { rabbitMqWrapper } from "../rabbitmq-wrapper";

const router = express.Router();

const endpointSecret = process.env.WEBHOOK_KEY as string;

router.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    let event: Stripe.Event;

    // Only verify the event if you have an endpoint secret defined.
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"]!;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err);
        return response.sendStatus(400);
      }
    } else {
      // Fallback for when the endpoint secret is not defined
      event = JSON.parse(request.body.toString());
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent; // Type assertion for better type safety
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );

        const payment = Payment.build({
          orderId: paymentIntent.metadata.orderId,
          paymentId: paymentIntent.id,
        });
        await payment.save();

        await new PaymentCreatedPublisher(rabbitMqWrapper.client).publish({
          id: payment.id,
          orderId: payment.orderId,
          paymentId: payment.paymentId,
        });
        break;

      //   case "payment_method.attached":
      //     const paymentMethod = event.data.object as Stripe.PaymentMethod; // Type assertion
      //     console.log(
      //       `PaymentMethod ${paymentMethod.id} attached to customer ${paymentMethod.customer}`
      //     );
      //     // Call a method to handle the successful attachment of a PaymentMethod
      //     // handlePaymentMethodAttached(paymentMethod);
      //     break;

      default:
        // Unexpected event type
        console.warn(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

export { router as webhook };
