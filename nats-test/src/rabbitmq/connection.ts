import amqplib from "amqplib";

export enum KEYS {
  TICKET_CREATED = "ticket.created",
  ORDER_CREATED = "order.created",
}

export enum QUEUES {
  TICKETING_QUEUE = "ticketing_queue",
}

export enum EXCHANGES {
  TICKETING_EXCHANGE = "ticketing_exchange",
}

export const connection = async () => {
  const conn = await amqplib.connect("amqp://user:password@localhost:5672");
  return conn;
};
