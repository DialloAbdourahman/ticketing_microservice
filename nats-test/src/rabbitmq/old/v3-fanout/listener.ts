import { connection, exchange } from "./connection";

const listen = async () => {
  const conn = await connection();

  const channel = await conn.createChannel();

  channel.assertExchange("logs", "fanout", { durable: false });

  const q = await channel.assertQueue("", { exclusive: true });

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
  channel.bindQueue(q.queue, exchange, "");

  channel.consume(
    q.queue,
    function (msg) {
      if (msg?.content) {
        console.log(" [x] %s", msg.content.toString());
      }
    },
    {
      noAck: true,
    }
  );
};

listen();
