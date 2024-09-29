import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-created-event";
import { EXCHANGES, KEYS } from "./utiles";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  key: KEYS.TICKET_CREATED = KEYS.TICKET_CREATED;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
