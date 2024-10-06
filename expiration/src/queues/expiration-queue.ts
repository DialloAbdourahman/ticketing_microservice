import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/ExpirationCompletePublisher";
import { rabbitMqWrapper } from "../rabbitmq-wrapper";

interface Payload {
  orderId: string;
}

const queue = "order:expiration";

const expirationQueue = new Queue<Payload>(queue, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(rabbitMqWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
