import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ErrorResponseType } from "../types/Errors";

const API_URL = "/api/orders";

export enum OrderStatus {
  Created = "created",
  Cancelled = "cancelled",
  AwaitingPayment = "awaiting:payment",
  Complete = "complete",
}

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: string;
  ticket: {
    id: string;
    title: string;
    price: number;
    updatedAt: string;
    createdAt: string;
    version: number;
  };
  updatedAt: string;
  createdAt: string;
  version: number;
};

export const useOrderProduct = () => {
  const [loading, setLoading] = useState(false);

  const orderProduct = async (ticketId: string) => {
    if (!ticketId) {
      toast.error("Ticket ID must be provided", {
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
      const { data } = await axios.post<Order>(`${API_URL}`, {
        ticketId,
      });
      toast.success("Ticket reserved successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });

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

  return { loading, orderProduct };
};

export const useGetOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Order[]>(`${API_URL}`, {
        withCredentials: true,
      });

      setOrders(data);
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

  return { getOrders, loading, orders };
};

export const useGetOrder = () => {
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getOrder = async (id: string) => {
    try {
      setLoading(true);
      setNotFound(false);
      const { data } = await axios.get<Order>(`${API_URL}/${id}`, {
        withCredentials: true,
      });

      setOrder(data);
    } catch (err) {
      const error = err as AxiosError<ErrorResponseType>;
      console.log(error);
      if (error.response?.status === 404) {
        setNotFound(true);
      }

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

  return { getOrder, loading, order, notFound };
};
