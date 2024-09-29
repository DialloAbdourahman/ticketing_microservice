import { connection, queue } from "./connection";

const produce = async () => {
  const conn = await connection();

  const channel = await conn.createChannel();
  // Declaring a queue is idempotent - it will only be created if it doesn't exist already. The message content is a byte array, so you can encode whatever you like there.
  channel.assertQueue(queue, { durable: true });

  // Here we use the default or nameless exchange: messages are routed to the queue with the name specified as first parameter, if it exists.
  channel.sendToQueue(queue, Buffer.from("something to do"), {
    persistent: true,
  });
  console.log("Published to queue", queue);

  setTimeout(() => {
    conn.close();
    console.log("Connection closed");
    process.exit(0);
  }, 500);
};

produce();
