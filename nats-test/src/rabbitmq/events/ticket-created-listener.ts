import { EXCHANGES, KEYS, QUEUES } from "./utiles";
import { Channel, ConsumeMessage } from "amqplib";
import { Listener } from "../events/base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queue = QUEUES.TICKETING_QUEUE;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
  key: KEYS.TICKET_CREATED = KEYS.TICKET_CREATED;

  onMessage(
    data: TicketCreatedEvent["data"],
    message: ConsumeMessage,
    channel: Channel
  ) {
    try {
      console.log("event data", data);
      channel.ack(message);
    } catch (error) {
      channel.nack(message);
    }
  }
}
