import { Ticket } from "../ticket";

it("implements optimistic concurrency control by not allowing an old version to be save over a current version", async () => {
  // Create an instance of a ticket.
  const ticket = Ticket.build({ price: 5, title: "Hello", userId: "123" });

  // Save ticket to db.
  await ticket.save();

  // Fetch ticket twice.
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched.
  firstInstance!.price = 10;
  secondInstance!.price = 10;

  // Save the first fetched ticket.
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error.
  // expect(async () => {
  //   await secondInstance!.save();
  // }).toThrow();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({ price: 5, title: "Hello", userId: "123" });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
