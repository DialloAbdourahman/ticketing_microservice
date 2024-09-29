import { EXCHANGES, KEYS, QUEUES } from "./utiles";
import { Channel, Connection, ConsumeMessage } from "amqplib";

interface Event {
  key: KEYS;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract queue: QUEUES;
  abstract key: T["key"];
  abstract exchange: EXCHANGES;

  abstract onMessage(
    data: T["data"],
    message: ConsumeMessage,
    channel: Channel
  ): void;

  private conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  parseMessage(msg: ConsumeMessage) {
    const data = msg.content.toString();

    return JSON.parse(data);
  }

  async listen() {
    const channel = await this.conn.createChannel();

    await channel.assertExchange(this.exchange, "topic", {
      durable: true,
    });

    const q = await channel.assertQueue(this.queue, {
      durable: true,
    });

    channel.bindQueue(q.queue, this.exchange, this.key);

    channel.consume(
      q.queue,
      (msg) => {
        if (msg) {
          const parsedData = this.parseMessage(msg);
          this.onMessage(parsedData, msg, channel);
        }
      },
      {
        noAck: false,
      }
    );

    console.log(
      `[*] Waiting for logs on key: ${this.key}, exchange: ${this.exchange} and queue: ${this.queue}. To exit press CTRL+C`
    );
  }
}
