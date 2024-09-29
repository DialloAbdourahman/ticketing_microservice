import { AckPolicy, connect, StringCodec } from "nats";

console.clear();

async function listenToMessages() {
  try {
    const nc = await connect({ servers: "http://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();

    // const datafromsub = await js.subscribe("ticket.created", {
    //   config: {
    //     durable_name: "me",
    //     ack_policy: AckPolicy.Explicit,
    //   },
    //   queue: "testing",
    // });
    // console.log(datafromsub);

    // Set up a durable subscription
    const sub = await js.consumers.get("tickets");
    const messages = await sub.consume();

    // Iterate through the messages
    for await (const m of messages) {
      console.log(
        `${m.seq} : ${m.subject} : Received message: ${sc.decode(m.data)}`
      );
      // console.log(m.seq);
      // console.log(m.subject);

      // console.log(m.redelivered ? "redilivered" : "not red");

      m.ack(); // Acknowledge the message to JetStream
    }

    console.log("Subscription closed");
  } catch (err) {
    console.error("Error listening to messages:", err);
  }
}

listenToMessages();
