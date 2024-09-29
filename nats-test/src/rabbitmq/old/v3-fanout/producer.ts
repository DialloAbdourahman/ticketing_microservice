import { connection, exchange } from "./connection";

const produce = async () => {
  const conn = await connection();

  const channel = await conn.createChannel();
  // The fanout exchange is very simple. As you can probably guess from the name, it just broadcasts all the messages it receives to all the queues it knows. And that's exactly what we need for our logger.
  // As you see, after establishing the connection we declared the exchange. This step is necessary as publishing to a non-existing exchange is forbidden.
  channel.assertExchange("logs", "fanout", { durable: false });

  // The empty string as second parameter means that we don't want to send the message to any specific queue. We want only to publish it to our 'logs' exchange.
  channel.publish(exchange, "", Buffer.from("something to do"));
  console.log("Published to exchange", exchange);

  setTimeout(() => {
    conn.close();
    console.log("Connection closed");
    process.exit(0);
  }, 500);
};

produce();
