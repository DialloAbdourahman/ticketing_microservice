import { TicketUpdatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { Ticket } from "../../../model/ticket";

export const ticketUpdatedHandler = async (
  data: TicketUpdatedEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Ticket updated handler called");

    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      // Ajustments here !!!!!!
      throw new Error("Ticket not found");
    }

    ticket.title = title;
    ticket.price = price;

    await ticket.save();

    channel.ack(message);
  } catch (error) {
    channel.nack(message);
  }
};

// large data test with multiple order service running.
