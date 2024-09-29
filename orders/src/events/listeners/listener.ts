import { EXCHANGES, KEYS, QUEUES } from "@daticketslearning/common";
import { Connection, ConsumeMessage } from "amqplib";
import { ticketCreatedHandler } from "./handlers/ticketCreatedHandler";
import { ticketUpdatedHandler } from "./handlers/ticketUpdatedHandler";

export class OrderServiceListener {
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
    const q = await channel.assertQueue(QUEUES.ORDERS_QUEUE, {
      durable: true,
    });

    // Queue bindings
    channel.bindQueue(
      q.queue,
      EXCHANGES.TICKETING_EXCHANGE,
      KEYS.TICKET_CREATED
    );
    channel.bindQueue(
      q.queue,
      EXCHANGES.TICKETING_EXCHANGE,
      KEYS.TICKET_UPDATED
    );

    channel.consume(
      q.queue,
      async (msg) => {
        if (msg) {
          const key = msg.fields.routingKey;
          const parsedData = this.parseMessage(msg);

          console.log(
            `Received message with key: ${key}, exchange: ${EXCHANGES.TICKETING_EXCHANGE}, queue: ${QUEUES.ORDERS_QUEUE} and message: `,
            parsedData
          );

          switch (key) {
            case KEYS.TICKET_CREATED:
              await ticketCreatedHandler(parsedData, msg, channel);
              break;
            case KEYS.TICKET_UPDATED:
              await ticketUpdatedHandler(parsedData, msg, channel);
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
      `[*] Waiting for messages on the order service and queue: ${QUEUES.ORDERS_QUEUE}. To exit press CTRL+C`
    );
  }
}
