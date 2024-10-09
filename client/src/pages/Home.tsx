import { useGetTickets } from "../api/TicketsApi";
import { useEffect } from "react";
import { AuthInitialStateType } from "../store/auth.slice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { getTickets, loading, tickets } = useGetTickets();

  const { user }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );

  useEffect(() => {
    getTickets();
  }, []);

  if (loading) {
    return <h1>Loading tickets ...</h1>;
  }

  return (
    <section>
      <h1>Tickets</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            return (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                {user && (
                  <td>
                    {user.id === ticket.userId && <button>Update</button>}{" "}
                    {user && (
                      <Link to={`/single-ticket/${ticket.id}`}>View</Link>
                    )}
                  </td>
                )}
              </tr>
            );
          })}{" "}
        </tbody>
      </table>
    </section>
  );
};

export default Home;
