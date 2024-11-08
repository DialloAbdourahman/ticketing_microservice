import express, { Request, Response } from "express";
import { Order } from "../model/order";
import {
  NotAuthorizedError,
  NotFoundError,
  OrchestrationResult,
  OrderStatus,
  requireAuth,
} from "@daticketslearning/common";
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher";
import { rabbitMqWrapper } from "../rabbitmq-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(rabbitMqWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    OrchestrationResult.success(res);
  }
);

export { router as deleteOrdersRouter };
