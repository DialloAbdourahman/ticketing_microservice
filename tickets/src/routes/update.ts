import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  OrchestrationResult,
} from "@daticketslearning/common";
import { validateCreateTicket } from "../middleware/validate-request";
import { Ticket } from "../model/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/TicketUpdatedPublisher";
import { rabbitMqWrapper } from "../rabbitmq-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  validateCreateTicket,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket.");
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(rabbitMqWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    OrchestrationResult.item(res, ticket);
  }
);

export { router as updateTicketRouter };
