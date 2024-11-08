import {
  getPageAndItemsPerPageFromRequestQuery,
  OrchestrationResult,
  requireAuth,
} from "@daticketslearning/common";
import express, { Request, Response } from "express";
import { Order } from "../model/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const { itemsPerPage, page, skip } =
    getPageAndItemsPerPageFromRequestQuery(req);

  const orders = await Order.find({ userId: req.currentUser!.id })
    .populate("ticket")
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(itemsPerPage);
  const count = await Order.countDocuments();

  OrchestrationResult.list(res, orders, count, itemsPerPage, page);
});

export { router as indexOrdersRouter };
