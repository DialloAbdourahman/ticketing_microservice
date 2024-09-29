import {
  EXCHANGES,
  KEYS,
  OrderCancelledEvent,
  Publisher,
} from "@daticketslearning/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  key: KEYS.ORDER_CANCELLED = KEYS.ORDER_CANCELLED;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
