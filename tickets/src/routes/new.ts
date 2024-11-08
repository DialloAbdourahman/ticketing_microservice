import express, { Request, Response } from "express";
import { OrchestrationResult, requireAuth } from "@daticketslearning/common";
import { validateCreateTicket } from "../middleware/validate-request";
import { Ticket } from "../model/ticket";
import { TicketCreatedPublisher } from "../events/publishers/TicketCreatedPublisher";
import { rabbitMqWrapper } from "../rabbitmq-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  validateCreateTicket,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(rabbitMqWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    OrchestrationResult.item(res, ticket, 201);
  }
);

export { router as createTicketRouter };
