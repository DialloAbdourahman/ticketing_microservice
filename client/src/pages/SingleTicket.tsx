import { useNavigate, useParams } from "react-router-dom";
import { useGetTicket } from "../api/TicketsApi";
import { useEffect } from "react";
import { useOrderProduct } from "../api/OrderApi";

const SingleTicket = () => {
  const { id } = useParams();
  const { getTicket, loading, ticket, notFound } = useGetTicket();
  const { loading: loadingOrderProduct, orderProduct } = useOrderProduct();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getTicket(id);
    }
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (notFound) {
    return <h1>Ticket does not exist...</h1>;
  }

  return (
    <div>
      <p>Title: {ticket?.title}</p>
      <p>Price: {ticket?.price}</p>
      {ticket?.orderId ? (
        <p>Ticket has been reserved/ordered already</p>
      ) : (
        <button
          disabled={loadingOrderProduct ? true : false}
          onClick={async () => {
            const order = await orderProduct(id as string);
            if (order) {
              setTimeout(() => {
                navigate(`/single-order/${order.id}`);
              }, 3000);
            }
          }}
        >
          {loadingOrderProduct ? "Loading..." : "Order product"}
        </button>
      )}
    </div>
  );
};

export default SingleTicket;
