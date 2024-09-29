import {
  EXCHANGES,
  KEYS,
  OrderCreatedEvent,
  Publisher,
} from "@daticketslearning/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  key: KEYS.ORDER_CREATED = KEYS.ORDER_CREATED;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
