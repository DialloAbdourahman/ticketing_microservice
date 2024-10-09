import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ErrorResponseType } from "../types/Errors";

const API_URL = "/api/payments";

export type PaymentIntent = {
  clientSecret: string;
};

export const useGetClientSecret = () => {
  const [loading, setLoading] = useState(false);

  const getClientSecret = async (orderId: string) => {
    if (!orderId) {
      toast.error("Order ID must be provided", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post<PaymentIntent>(
        `${API_URL}/create-payment-intent`,
        {
          orderId,
        }
      );

      return data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);

      toast.error(
        error.response?.data.errors
          ? `${error.response.data.errors.map(
              (errorMessage) => `${errorMessage.message} `
            )}`
          : "Something went wrong",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: 0,
          toastId: "my_toast",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, getClientSecret };
};
