import { ExpirationComleteEvent, OrderStatus } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { expirationCompleteHandler } from "../expirationCompleteHandler";
import { Ticket } from "../../../../model/ticket";
import { Order } from "../../../../model/order";

it("expires an order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12,
    title: "Concert",
  });
  await ticket.save();

  // Create an order
  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket: ticket,
    userId: "asdf",
  });
  await order.save();

  // Create a fake data event.
  const data: ExpirationComleteEvent["data"] = {
    orderId: order.id,
  };

  // Create a fake channel object and message object.
  // @ts-ignore
  const msg: ConsumeMessage = {};
  // @ts-ignore
  const channel: Channel = {
    ack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
    nack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
  };

  // Call the handler
  await expirationCompleteHandler(data, msg, channel);

  // Write assertions to make sure that the order is updated
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(updatedOrder?.version).toEqual(1);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
  expect(channel.nack).not.toHaveBeenCalled();
});
