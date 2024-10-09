import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

type Props = {
  setClientSecret: React.Dispatch<React.SetStateAction<string>>;
};

export default function CheckoutForm({ setClientSecret }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const [message, setMessage] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setIsLoading(false);

    if (!error) {
      setMessage("Payment went well");

      setTimeout(() => {
        setClientSecret("");
        navigate("/");
      }, 3000);
      return;
    }

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      <form id="payment-form" onSubmit={(e) => handleSubmit(e)}>
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
