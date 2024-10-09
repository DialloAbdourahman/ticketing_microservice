import { useState } from "react";
import { Ticket, useCreateTicket } from "../api/TicketsApi";
import { useNavigate } from "react-router-dom";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const navigate = useNavigate();

  const { createTicket, loading } = useCreateTicket();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ticket = await createTicket(title, price);

    if (!ticket) return;

    setTickets([ticket, ...tickets]);
    setTitle("");
    setPrice("");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <h1>New Ticket</h1>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          onBlur={onBlur}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button>Save</button>
      <div>
        {tickets.map((ticket) => {
          return (
            <li key={ticket.id}>
              {ticket.title}, {ticket.price}
            </li>
          );
        })}
      </div>
    </form>
  );
};

export default NewTicket;
