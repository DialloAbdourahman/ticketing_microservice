import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";

import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";

export const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = signinTest();
  const userTwo = signinTest();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const orderOneResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);
  const orderTwoResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send();

  expect(response.status).toEqual(200);
  expect(response.body.data.length).toEqual(2);
  expect(response.body.data[1].id).toEqual(orderOneResponse.body.data.id);
  expect(response.body.data[0].id).toEqual(orderTwoResponse.body.data.id);
  expect(response.body.data[1].ticket.id).toEqual(ticketTwo.id);
  expect(response.body.data[0].ticket.id).toEqual(ticketThree.id);
});
