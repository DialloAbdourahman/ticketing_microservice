import { useEffect } from "react";
import { OrderStatus, useGetOrders } from "../api/OrderApi";
import { Link } from "react-router-dom";

const OrdersList = () => {
  const { getOrders, loading, orders } = useGetOrders();

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {orders.map((order) => {
        return (
          <p key={order.id}>
            {order.ticket.title} ({order.ticket.price}) {order.status}{" "}
            {order.status === OrderStatus.Created && (
              <Link to={`/single-order/${order.id}`}>Click to view order</Link>
            )}
          </p>
        );
      })}
    </div>
  );
};

export default OrdersList;
