import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "asdf";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.data.id}`)
    .send({ title, price })
    .expect(200);
  expect(ticketResponse.body.data.title).toBe(title);
  expect(ticketResponse.body.data.price).toBe(price);
});
