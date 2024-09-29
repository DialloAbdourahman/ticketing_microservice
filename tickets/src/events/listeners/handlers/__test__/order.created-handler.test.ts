import { OrderCreatedEvent, OrderStatus } from "@daticketslearning/common";
import mongoose from "mongoose";
import { Ticket } from "../../../../model/ticket";
import { ConsumeMessage } from "amqplib";
import { orderCreatedHandler } from "../order-created-handler";

it("sets the orderId of the ordered ticket and acknowledges the message at the end", async () => {
  // Create a ticket.
  const ticket = Ticket.build({
    price: 99,
    title: "concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // Create a fake data object.
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
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

  // Write assertions to make sure a ticket is created
  const reservedTicket = await Ticket.findById(ticket.id);
  expect(reservedTicket).toBeDefined();
  expect(reservedTicket?.orderId).toEqual(data.id);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
});
