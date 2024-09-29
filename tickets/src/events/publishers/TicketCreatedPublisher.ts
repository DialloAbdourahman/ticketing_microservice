import {
  Publisher,
  TicketCreatedEvent,
  EXCHANGES,
  KEYS,
} from "@daticketslearning/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  key: KEYS.TICKET_CREATED = KEYS.TICKET_CREATED;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
