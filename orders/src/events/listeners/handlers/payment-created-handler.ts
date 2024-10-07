import { OrderStatus, PaymentCreatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { Ticket } from "../../../model/ticket";
import { rabbitMqWrapper } from "../../../rabbitmq-wrapper";
import { Order } from "../../../model/order";

export const paymentCreatedHandler = async (
  data: PaymentCreatedEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Payment created handler called");

    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Complete;
    await order.save();

    // Emit an order updated event so the the payment service can mark the order as complete and as such, no further payments will be accepted with that order

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
