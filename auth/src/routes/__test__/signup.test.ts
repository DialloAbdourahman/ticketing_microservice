import request from "supertest";
import { app } from "../../app";

it("Returns a 201 on successful signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(201);
});

it("Returns a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78gmail.com",
      password: "password",
    })
    .expect(400);
});

it("Returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "p",
    })
    .expect(400);
});

it("Returns a 400 with missing email and password", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("Returns a 400 with missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "dialli@ddd.ccc" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "asdfasdfasdf" })
    .expect(400);
});

it("Disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("Sets a cookie after a successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
