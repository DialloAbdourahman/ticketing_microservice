import express, { Request, Response } from "express";
import { Ticket } from "../model/ticket";
import {
  getPageAndItemsPerPageFromRequestQuery,
  OrchestrationResult,
} from "@daticketslearning/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const { itemsPerPage, page, skip } =
    getPageAndItemsPerPageFromRequestQuery(req);

  const tickets = await Ticket.find({
    orderId: undefined,
  })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(itemsPerPage);
  const count = await Ticket.countDocuments();

  OrchestrationResult.list(res, tickets, count, itemsPerPage, page);
});

export { router as indexTicketRouter };
