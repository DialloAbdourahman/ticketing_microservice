import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signinTest())
    .send({ title: "asdf", price: 20 })
    .expect(201);
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send({}).expect(200);
  expect(response.body.data.length).toBe(3);
});
