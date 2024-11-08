import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";

import { buildTicket } from "./index.test";
import { OrderStatus } from "@daticketslearning/common";
import { Order } from "../../model/order";
import { rabbitMqWrapper } from "../../rabbitmq-wrapper";

it("cancels an order", async () => {
  const ticketOne = await buildTicket();

  const userOne = signinTest();

  const orderCreatedResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${orderCreatedResponse.body.data.id}`)
    .set("Cookie", userOne)
    .send();

  expect(response.status).toEqual(200);

  const updatedOrder = await Order.findById(orderCreatedResponse.body.data.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits an event after cancelling an order", async () => {
  const ticketOne = await buildTicket();

  const userOne = signinTest();

  const orderCreatedResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${orderCreatedResponse.body.data.id}`)
    .set("Cookie", userOne)
    .send();

  expect(response.status).toEqual(200);

  const updatedOrder = await Order.findById(orderCreatedResponse.body.data.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

  expect(rabbitMqWrapper.client.createChannel).toHaveBeenCalled();
});
