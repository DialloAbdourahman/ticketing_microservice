import { TicketCreatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { ticketCreatedHandler } from "../ticketCreatedHandler";
import { Ticket } from "../../../../model/ticket";

it("creates and save a ticket", async () => {
  // Create a fake data event.
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: "Concert",
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
  await ticketCreatedHandler(data, msg, channel);

  // Write assertions to make sure a ticket is created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
  expect(ticket?.version).toEqual(0);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
});
