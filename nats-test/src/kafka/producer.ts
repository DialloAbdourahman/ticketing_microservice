import { Partitioners } from "kafkajs";
import { kafka } from "./kafka";

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const produce = async () => {
  await producer.connect();
  const data = {
    id: "1",
    name: "Ticket one",
    description: "asdf asdfasdf asdfasdf asdf asdf asdf.",
  };
  await producer.send({
    topic: "test-topic",
    messages: [{ value: JSON.stringify(data) }],
  });

  await producer.disconnect();
};

produce();
