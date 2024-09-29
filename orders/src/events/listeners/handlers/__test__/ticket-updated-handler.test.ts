import { TicketUpdatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { Ticket } from "../../../../model/ticket";
import { ticketUpdatedHandler } from "../ticketUpdatedHandler";

it("finds, updates, and saves a ticket", async () => {
  // Create a ticket
  const newTicket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: "Concert",
  });
  await newTicket.save();

  // Create a fake data event.
  const data: TicketUpdatedEvent["data"] = {
    id: newTicket.id,
    price: 15,
    title: "Concert again",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: newTicket.version + 1,
  };

  // Create a fake channel object and message object.
  // @ts-ignore
  const msg: ConsumeMessage = {};
  // @ts-ignore
  const channel: Channel = {
    ack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
  };

  // Call the handler
  await ticketUpdatedHandler(data, msg, channel);

  // Write assertions to make sure a ticket is updated
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
  expect(ticket?.version).toEqual(1);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.ack).toHaveBeenCalled();
});

it("does not call ack() if the event has a skipped version number", async () => {
  // Create a ticket
  const newTicket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: "Concert",
  });
  await newTicket.save();

  // Create a fake data event.
  const data: TicketUpdatedEvent["data"] = {
    id: newTicket.id,
    price: 15,
    title: "Concert again",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: newTicket.version + 2,
  };

  // Create a fake channel object and message object.
  // @ts-ignore
  const msg: ConsumeMessage = {};
  // @ts-ignore
  const channel: Channel = {
    nack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
    ack: jest.fn().mockImplementation((msg: ConsumeMessage) => {}),
  };

  // Call the handler
  try {
    await ticketUpdatedHandler(data, msg, channel);
  } catch (error) {}

  // Write assertions to make sure a ticket is not updated
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(newTicket.title);
  expect(ticket?.price).toEqual(newTicket.price);
  expect(ticket?.version).toEqual(0);

  // Write assertions to make sure that we called the ack() on the channel alongside it's message
  expect(channel.nack).toHaveBeenCalled();
  expect(channel.ack).not.toHaveBeenCalled();
});
