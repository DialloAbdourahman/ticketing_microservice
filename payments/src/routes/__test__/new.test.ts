import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";
import mongoose from "mongoose";
import { Order } from "../../model/order";
import { OrderStatus } from "@daticketslearning/common";
import { stripe } from "../../stripe";

it("throw a not found error if we try to pay for a non existing order", async () => {
  const response = await request(app)
    .post("/api/payments/create-payment-intent")
    .set("Cookie", signinTest())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
  expect(response.status).toEqual(404);
});

it("throw an unauthorized error when purchasing an order that doesn't belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments/create-payment-intent")
    .set("Cookie", signinTest())
    .send({
      orderId: order.id,
    });
  expect(response.status).toEqual(401);
});

it("throw an error when purchasing a cancelled order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Cancelled,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments/create-payment-intent")
    .set("Cookie", signinTest(order.userId))
    .send({
      orderId: order.id,
    });
  expect(response.status).toEqual(400);
});

it("returns a 201 with a valid input", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments/create-payment-intent")
    .set("Cookie", signinTest(order.userId))
    .send({
      orderId: order.id,
    });
  expect(response.status).toEqual(201);
  expect(stripe.paymentIntents.create).toHaveBeenCalled();

  const paymentIntentOptions = (stripe.paymentIntents.create as jest.Mock).mock
    .calls[0][0];

  expect(paymentIntentOptions.currency).toBe("usd");
  expect(paymentIntentOptions.amount).toBe(order.price);
});
