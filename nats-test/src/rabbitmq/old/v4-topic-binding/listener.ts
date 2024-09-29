import { connection } from "./connection";

var args = ["kern.critical"];

const listen = async () => {
  const conn = await connection();

  const channel = await conn.createChannel();
  var exchange = "topic_logs";

  channel.assertExchange(exchange, "topic", {
    durable: false,
  });

  const q = await channel.assertQueue("", {
    exclusive: true,
  });

  console.log("[*] Waiting for logs. To exit press CTRL+C");

  args.forEach(function (key) {
    channel.bindQueue(q.queue, exchange, key);
  });

  channel.consume(
    q.queue,
    function (msg) {
      if (msg) {
        console.log(
          " [x] %s:'%s'",
          msg.fields.routingKey,
          msg.content.toString()
        );
      }
    },
    {
      noAck: true,
    }
  );
};

listen();
