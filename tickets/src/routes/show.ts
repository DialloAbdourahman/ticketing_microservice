import express, { Request, Response } from "express";
import { NotFoundError, OrchestrationResult } from "@daticketslearning/common";
import { Ticket } from "../model/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  OrchestrationResult.item(res, ticket);
});

export { router as showTicketRouter };
