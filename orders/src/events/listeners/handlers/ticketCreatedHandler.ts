import { TicketCreatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { Ticket } from "../../../model/ticket";

export const ticketCreatedHandler = async (
  data: TicketCreatedEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Ticket created handler called");

    const { title, price, id } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
