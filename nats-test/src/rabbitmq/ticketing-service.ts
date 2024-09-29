import { connection, KEYS, EXCHANGES } from "./connection";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const msg = {
  id: "1",
  title: "Ticket one",
  price: 500,
};

const publishOrderCreated = async () => {
  const conn = await connection();

  const publisher = new TicketCreatedPublisher(conn);
  await publisher.publish(msg);
};

publishOrderCreated();
