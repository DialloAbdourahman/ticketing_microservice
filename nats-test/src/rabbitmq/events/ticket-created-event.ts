import { KEYS } from "./utiles";

export interface TicketCreatedEvent {
  key: KEYS.TICKET_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
