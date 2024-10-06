import { OrderCancelledEvent, OrderStatus } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { Order } from "../../../../model/order";
import { orderCancelledHandler } from "../order-cancelled-handler";

it("cancels and existing order", async () => {
  // Create a fake data event.
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    version: 1,
  };

  const order = Order.build({
    id: data.id,
    price: 10,
    status: OrderStatus.Created,
    userId: "asdf",
  });
  await order.save();

  // Create a fake channel object and message object.
  // @ts-ignore
  const msg: ConsumeMessage = {};
  // @ts-ignore
  const channel: Channel = {
    ack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
  };

  // Call the handler
  await orderCancelledHandler(data, msg, channel);

  // Write assertions to make sure a order is created
  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder?.id).toEqual(data.id);
  expect(updatedOrder?.version).toEqual(1);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
});
