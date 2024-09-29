import { connection, queue } from "./connection";

const listen = async () => {
  const conn = await connection();

  const channel = await conn.createChannel();
  // Note that we declare the queue here, as well. Because we might start the consumer before the publisher, we want to make sure the queue exists before we try to consume messages from it.
  channel.assertQueue(queue, { durable: true });
  // This tells RabbitMQ not to give more than one message to a worker at a time. Or, in other words, don't dispatch a new message to a worker until it has processed and acknowledged the previous one. Instead, it will dispatch it to the next worker that is not still busy.
  channel.prefetch(1);

  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        console.log("Received:", msg.content.toString());
        channel.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    },
    { noAck: false }
  );
};

listen();
