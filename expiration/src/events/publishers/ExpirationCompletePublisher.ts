import {
  Publisher,
  EXCHANGES,
  KEYS,
  ExpirationComleteEvent,
} from "@daticketslearning/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationComleteEvent> {
  key: KEYS.EXPIRATION_COMPLETE = KEYS.EXPIRATION_COMPLETE;
  exchange = EXCHANGES.TICKETING_EXCHANGE;
}
