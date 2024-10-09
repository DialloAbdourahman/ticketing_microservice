import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useGetOrder } from "../api/OrderApi";
import { useEffect, useState } from "react";
import { useGetClientSecret } from "../api/PaymentApi";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51KenTYBO66gD7lhbSB8wcJir5hO8pzNC7DegpAh1XY9YNalVQPX5YG2rqv9cXwCbKxmoS3fJ1k0PAm2U4X4tfYqh00telBpIp6"
);

const SingleOrder = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();
  const { getOrder, loading, order, notFound } = useGetOrder();
  const { getClientSecret, loading: loadingClientSecret } =
    useGetClientSecret();

  const initiatePayment = async () => {
    const data = await getClientSecret(id as string);
    if (!data) return;

    setClientSecret(data.clientSecret);
  };

  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  useEffect(() => {
    if (id) {
      getOrder(id);
    }
  }, [id]);

  useEffect(() => {
    if (order) {
      const findTimeLeft = () => {
        const expiresAt = new Date(order?.expiresAt as string);
        const currentTime = new Date();

        const minutesLeft = Math.floor(
          (expiresAt.getTime() - currentTime.getTime()) / (1000 * 60)
        );

        setTimeLeft(Math.round(minutesLeft));
      };

      findTimeLeft();

      const timerId = setInterval(findTimeLeft, 10000);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [order]);

  if (loading || loadingClientSecret) {
    return <h1>Loading...</h1>;
  }

  if (notFound) {
    return <h1>Ticket does not exist...</h1>;
  }

  if (timeLeft <= 0) {
    return <h1>Order has expired</h1>;
  }

  return (
    <section>
      <h2>Still got {timeLeft} minutes to pay</h2>
      <p>Ticket: {order?.ticket.title}</p>
      <p>Price: {order?.ticket.price}</p>
      <button onClick={initiatePayment}>Pay</button>

      {clientSecret && (
        <Elements
          options={{ clientSecret, appearance: { theme: "stripe" }, loader }}
          stripe={stripePromise}
        >
          <CheckoutForm setClientSecret={setClientSecret} />
        </Elements>
      )}
    </section>
  );
};

export default SingleOrder;
