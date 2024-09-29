import amqplib from "amqplib";

export const connection = async () => {
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  return conn;
};

export const exchange = "logs";
