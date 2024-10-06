import { EXCHANGES, KEYS, QUEUES } from "@daticketslearning/common";
import { Connection, ConsumeMessage } from "amqplib";
import { orderCreatedHandler } from "./handlers/order-created-handler";

export class ExpirationServiceListener {
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
    const q = await channel.assertQueue(QUEUES.EXPIRATION_QUEUE, {
      durable: true,
    });

    // Queue bindings
    channel.bindQueue(
      q.queue,
      EXCHANGES.TICKETING_EXCHANGE,
      KEYS.ORDER_CREATED
    );

    channel.consume(
      q.queue,
      async (msg) => {
        if (msg) {
          const key = msg.fields.routingKey;
          const parsedData = this.parseMessage(msg);

          console.log(
            `Received message with key: ${key}, exchange: ${EXCHANGES.TICKETING_EXCHANGE}, queue: ${QUEUES.EXPIRATION_QUEUE} and message: `,
            parsedData
          );

          switch (key) {
            case KEYS.ORDER_CREATED:
              await orderCreatedHandler(parsedData, msg, channel);
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
      `[*] Waiting for messages on the expiration service and queue: ${QUEUES.EXPIRATION_QUEUE}. To exit press CTRL+C`
    );
  }
}
