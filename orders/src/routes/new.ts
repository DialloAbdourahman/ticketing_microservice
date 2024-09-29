import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@daticketslearning/common";
import { validateCreateOrder } from "../middleware/validate-request";
import { Ticket } from "../model/ticket";
import { Order } from "../model/order";
import { rabbitMqWrapper } from "../rabbitmq-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  validateCreateOrder,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the db.
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved.
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("This ticket has been already been reserved.");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the db.
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created.
    await new OrderCreatedPublisher(rabbitMqWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(), // UTC time stamp
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as newOrdersRouter };
