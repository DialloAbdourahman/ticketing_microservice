import express, { Request, Response } from "express";
import { Order } from "../model/order";
import {
  NotAuthorizedError,
  NotFoundError,
  OrchestrationResult,
  requireAuth,
} from "@daticketslearning/common";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    OrchestrationResult.item(res, order);
  }
);

export { router as showOrdersRouter };
