import { connection } from "./connection";

import { TicketCreatedListener } from "./events/ticket-created-listener";

const initializeListeners = async () => {
  const conn = await connection();
  await new TicketCreatedListener(conn).listen();
};

initializeListeners();
