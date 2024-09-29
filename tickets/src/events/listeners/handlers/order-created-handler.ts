import { OrderCreatedEvent } from "@daticketslearning/common";
import { Channel, ConsumeMessage } from "amqplib";
import { Ticket } from "../../../model/ticket";
import { TicketUpdatedPublisher } from "../../publishers/TicketUpdatedPublisher";
import { rabbitMqWrapper } from "../../../rabbitmq-wrapper";

export const orderCreatedHandler = async (
  data: OrderCreatedEvent["data"],
  message: ConsumeMessage,
  channel: Channel
) => {
  try {
    console.log("Order created handler called");

    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, no error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting it's order id property
    ticket.orderId = data.id;

    // Save the ticket
    await ticket.save();

    // Publish a ticket updated event
    await new TicketUpdatedPublisher(rabbitMqWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, true);
  }
};
