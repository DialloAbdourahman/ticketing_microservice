import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";
import { Ticket } from "../../model/ticket";

// The mock one with the help of jest mocks
import { rabbitMqWrapper } from "../../rabbitmq-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ price: 100, title: "" })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ price: 100 })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ price: -10, title: "titleasdf" })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ title: "asdfasdf" })
    .expect(400);
});

it("creates a ticket with valid input", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  const ticket = await Ticket.findOne({ title: "asdfasdf" });
  expect(ticket).not.toBe(null);
  expect(ticket?.title).toBe("asdfasdf");
  expect(ticket?.price).toBe(20);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ title: "asdfasdf", price: 20 })
    .expect(201);

  // console.log(rabbitMqWrapper);

  expect(rabbitMqWrapper.client.createChannel).toHaveBeenCalled();
});
