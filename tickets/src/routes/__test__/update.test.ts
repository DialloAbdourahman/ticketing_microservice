import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";
import { rabbitMqWrapper } from "../../rabbitmq-wrapper";

it("returns a 404 is the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signinTest())
    .send({ title: "asdf", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "asdf", price: 20 })
    .expect(401);
});

it("returns a 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signinTest())
    .send({ title: "asdfasdf", price: 20 })
    .expect(401);
});

it("returns a 400 if the user provided an invalid title or price", async () => {
  const cookie = signinTest();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asdfasdf", price: -5 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = signinTest();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asdf", price: 20 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toBe("asdf");
});

it("publishes an event", async () => {
  const cookie = signinTest();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asdf", price: 20 })
    .expect(200);

  expect(rabbitMqWrapper.client.createChannel).toHaveBeenCalled();
});

it("it rejects updates if the ticket is reserved", async () => {
  const cookie = signinTest();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asdf", price: 20 })
    .expect(400);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toBe("asdfasdf");
  expect(ticketResponse.body.price).toBe(20);
});
