import axios from "axios";

const Cookie =
  "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkyWldWbE1EUTBNbUZpTWpNMlpEWTRORGhsWmpnNU1DSXNJbVZ0WVdsc0lqb2laR2xoYkd4cFlXSmtiM1Z5WVdodFlXNDNPRUJuYldGcGJDNWpiMjFrSWl3aWFXRjBJam94TnpJMk9UTXhNREV5ZlEuaXNCR0d5elR5R1pCQTlyVDlJdU1yXzNuTzJsWl84NzFFemlQQkdzd2liUSJ9";

const reqFunction = async () => {
  const { data } = await axios.post(
    `http://ticketing.dev/api/tickets`,
    {
      title: "ticket",
      price: 5,
    },
    {
      headers: { Cookie },
    }
  );

  await axios.put(
    `http://ticketing.dev/api/tickets/${data.id}`,
    {
      title: "ticket",
      price: 10,
    },
    {
      headers: { Cookie },
    }
  );

  await axios.put(
    `http://ticketing.dev/api/tickets/${data.id}`,
    {
      title: "ticket",
      price: 15,
    },
    {
      headers: { Cookie },
    }
  );
};

const run = async () => {
  for (let i = 0; i < 250; i++) {
    await reqFunction();
  }
};

run();
