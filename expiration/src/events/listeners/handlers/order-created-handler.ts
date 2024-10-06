import { OrderCreatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { expirationQueue } from "../../../queues/expiration-queue";

export const orderCreatedHandler = async (
  data: OrderCreatedEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Order created handler called");

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({ orderId: data.id }, { delay });

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
