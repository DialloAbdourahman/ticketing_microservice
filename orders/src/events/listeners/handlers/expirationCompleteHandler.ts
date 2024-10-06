import { ExpirationComleteEvent, OrderStatus } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { Order } from "../../../model/order";
import { OrderCancelledPublisher } from "../../publishers/OrderCancelledPublisher";
import { rabbitMqWrapper } from "../../../rabbitmq-wrapper";

export const expirationCompleteHandler = async (
  data: ExpirationComleteEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Expiration complete handler called");

    const { orderId } = data;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(rabbitMqWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
