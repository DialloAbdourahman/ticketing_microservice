import { OrderStatus, OrderCancelledEvent } from "@daticketslearning/common";
import mongoose from "mongoose";
import { Ticket } from "../../../../model/ticket";
import { ConsumeMessage } from "amqplib";
import { orderCancelledHandler } from "../order-cancelled-handler";

it("sets the orderId of the ordered cancelled ticket to undefined and acknowledges the message at the end", async () => {
  // Create a ticket.
  const ticket = Ticket.build({
    price: 99,
    title: "concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.orderId = new mongoose.Types.ObjectId().toHexString();
  await ticket.save();

  // Create a fake data object.
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
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
  await orderCancelledHandler(data, msg, channel);

  // Write assertions to make sure a ticket is created
  const cancelledTicket = await Ticket.findById(ticket.id);
  expect(cancelledTicket).toBeDefined();
  expect(cancelledTicket?.orderId).toBeUndefined();

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
});
