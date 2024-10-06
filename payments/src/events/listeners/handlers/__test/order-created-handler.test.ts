import { OrderCreatedEvent, OrderStatus } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { orderCreatedHandler } from "../order-created-handler";
import { Order } from "../../../../model/order";

it("creates and save an order", async () => {
  // Create a fake data event.
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "",
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // Create a fake channel object and message object.
  // @ts-ignore
  const msg: ConsumeMessage = {};
  // @ts-ignore
  const channel: Channel = {
    ack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
  };

  // Call the handler
  await orderCreatedHandler(data, msg, channel);

  // Write assertions to make sure a order is created
  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order?.id).toEqual(data.id);
  expect(order?.price).toEqual(data.ticket.price);
  expect(order?.version).toEqual(0);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
});
