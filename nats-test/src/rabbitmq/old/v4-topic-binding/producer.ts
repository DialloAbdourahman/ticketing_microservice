import { connection } from "./connection";

const produce = async () => {
  const conn = await connection();

  const channel = await conn.createChannel();

  var exchange = "topic_logs";
  var args = ["kern.critical"];
  var key = args.length > 0 ? args[0] : "anonymous.info";

  channel.assertExchange(exchange, "topic", {
    durable: false,
  });

  channel.publish(exchange, key, Buffer.from("A message"));
  console.log(" [x] Sent %s:'%s'", key, "A message");

  setTimeout(() => {
    conn.close();
    console.log("Connection closed");
    process.exit(0);
  }, 500);
};

produce();
