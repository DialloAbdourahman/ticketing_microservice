import amqplib from "amqplib";

export const connection = async () => {
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  return conn;
};

export const queue = "tasks";

const queues = ["users", "tickets"];

// User created queue, user updated queue, etc
// Messages should not only be recived in queues, imagine if another service needs that same message
