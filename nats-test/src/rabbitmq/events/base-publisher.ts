import { EXCHANGES, KEYS, QUEUES } from "./utiles";
import { Channel, Connection, ConsumeMessage } from "amqplib";

interface Event {
  key: KEYS;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract key: T["key"];
  abstract exchange: EXCHANGES;

  private conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  async publish(data: T["data"]) {
    const channel = await this.conn.createChannel();

    await channel.assertExchange(this.exchange, "topic", {
      durable: true,
    });

    channel.publish(
      this.exchange,
      this.key,
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
      }
    );

    console.log(
      `[*] Sent event with key: ${this.key} and exchange: ${this.exchange}. To exit press CTRL+C`
    );

    setTimeout(() => {
      this.conn.close();
      console.log("Connection closed");
      process.exit(0);
    }, 500);
  }
}
