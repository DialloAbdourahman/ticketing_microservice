import request from "supertest";
import { app } from "../../app";

it("Fails when an email doesn't exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("Fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "passworde",
    })
    .expect(400);
});

it("Responds with a cookie with valid data", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "dialliabdourahman78@gmail.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
