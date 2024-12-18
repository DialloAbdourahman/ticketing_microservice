import request from "supertest";
import { app } from "../../app";
import { signinTest } from "../../test/setup";

it("Responds with details about current user.", async () => {
  const cookie = await signinTest();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.data.email).toBe("test@test.com");
});
