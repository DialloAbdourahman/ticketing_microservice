import {
  Publisher,
  EXCHANGES,
  KEYS,
  PaymentCreatedEvent,
} from "@daticketslearning/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  key: KEYS.PAYMENT_CREATED = KEYS.PAYMENT_CREATED;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
