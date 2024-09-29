import { StringCodec } from "nats";
import { connectToNats } from "./stream";

console.clear();

async function publishMessage() {
  try {
    const nc = await connectToNats();
    const js = nc.jetstream();
    const sc = StringCodec();

    const data = {
      id: "123",
      title: "concert",
      price: 20,
    };

    await js.publish("ticket.created", sc.encode(JSON.stringify(data)));

    console.log("Message published to 'ticket.created'");
  } catch (err) {
    console.error("Error publishing message:", err);
  }
}

publishMessage();
