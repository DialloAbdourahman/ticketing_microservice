import { EXCHANGES, KEYS, QUEUES } from "@daticketslearning/common";
import { Connection, ConsumeMessage } from "amqplib";
import { orderCreatedHandler } from "./handlers/order-created-handler";
import { orderCancelledHandler } from "./handlers/order-cancelled-handler";

export class TicketsServiceListener {
  private conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  parseMessage(msg: ConsumeMessage) {
    const data = msg.content.toString();
    return JSON.parse(data);
  }

  async listen() {
    // Channel creation
    const channel = await this.conn.createChannel();

    // Exchange creation / assertion
    await channel.assertExchange(EXCHANGES.TICKETING_EXCHANGE, "topic", {
      durable: true,
    });

    // Queue creation / assertion
    const q = await channel.assertQueue(QUEUES.TICKETING_QUEUE, {
      durable: true,
    });

    // Queue bindings
    channel.bindQueue(
      q.queue,
      EXCHANGES.TICKETING_EXCHANGE,
      KEYS.ORDER_CREATED
    );
    channel.bindQueue(
      q.queue,
      EXCHANGES.TICKETING_EXCHANGE,
      KEYS.ORDER_CANCELLED
    );

    channel.consume(
      q.queue,
      async (msg) => {
        if (msg) {
          const key = msg.fields.routingKey;
          const parsedData = this.parseMessage(msg);

          console.log(
            `Received message with key: ${key}, exchange: ${EXCHANGES.TICKETING_EXCHANGE}, queue: ${QUEUES.TICKETING_QUEUE} and message: `,
            parsedData
          );

          switch (key) {
            case KEYS.ORDER_CREATED:
              await orderCreatedHandler(parsedData, msg, channel);
              break;
            case KEYS.ORDER_CANCELLED:
              await orderCancelledHandler(parsedData, msg, channel);
              break;
            default:
              channel.nack(msg, false, false);
              break;
          }
        }
      },
      {
        noAck: false,
      }
    );

    console.log(
      `[*] Waiting for messages on the tickets service and queue: ${QUEUES.TICKETING_QUEUE}. To exit press CTRL+C`
    );
  }
}
