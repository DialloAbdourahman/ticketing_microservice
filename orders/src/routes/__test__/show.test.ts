import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";

import { buildTicket } from "./index.test";

it("fetches a ticket", async () => {
  const ticketOne = await buildTicket();

  const userOne = signinTest();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .send();

  expect(response.status).toEqual(200);
  expect(response.body.id).toEqual(order.id);
});
