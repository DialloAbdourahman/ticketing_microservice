import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";
import mongoose from "mongoose";
import { Order } from "../../model/order";
import { Ticket } from "../../model/ticket";
import { OrderStatus } from "@daticketslearning/common";
import { rabbitMqWrapper } from "../../rabbitmq-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signinTest())
    .send({
      ticketId,
    });
  expect(response.status).toEqual(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "dddd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signinTest())
    .send({
      ticketId: ticket.id,
    });
  expect(response.status).toEqual(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signinTest())
    .send({
      ticketId: ticket.id,
    });
  expect(response.status).toEqual(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signinTest())
    .send({
      ticketId: ticket.id,
    });
  expect(response.status).toEqual(201);

  expect(rabbitMqWrapper.client.createChannel).toHaveBeenCalled();
});
