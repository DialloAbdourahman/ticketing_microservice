import {
  Publisher,
  TicketUpdatedEvent,
  EXCHANGES,
  KEYS,
} from "@daticketslearning/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  key: KEYS.TICKET_UPDATED = KEYS.TICKET_UPDATED;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
