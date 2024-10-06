import { OrderCancelledEvent, OrderStatus } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { rabbitMqWrapper } from "../../../rabbitmq-wrapper";
import { Order } from "../../../model/order";

export const orderCancelledHandler = async (
  data: OrderCancelledEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Order cancelled handler called");

    // Not very usefull because it is just created and cancelled event. We did it just in case we need it in the future
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!order) {
      throw new Error("Order doesn't exist");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
