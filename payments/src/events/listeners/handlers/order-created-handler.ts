import { OrderCreatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { Order } from "../../../model/order";

export const orderCreatedHandler = async (
  data: OrderCreatedEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Order created handler called");

    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
    });
    await order.save();

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
