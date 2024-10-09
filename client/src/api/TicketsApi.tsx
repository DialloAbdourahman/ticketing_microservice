import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ErrorResponseType } from "../types/Errors";

const API_URL = "/api/tickets";

export type Ticket = {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
  updatedAt: string;
  createdAt: string;
};

export const useCreateTicket = () => {
  const [loading, setLoading] = useState(false);

  const createTicket = async (title: string, price: string) => {
    if (!title || !price) {
      toast.error("Enter all fields", {
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
      const { data } = await axios.post<Ticket>(`${API_URL}`, {
        title,
        price,
      });
      toast.success("Ticket created successfully.", {
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

  return { loading, createTicket };
};

export const useGetTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const getTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Ticket[]>(`${API_URL}`, {
        withCredentials: true,
      });

      setTickets(data);
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

  return { getTickets, loading, tickets };
};

export const useGetTicket = () => {
  const [ticket, setTicket] = useState<Ticket>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getTicket = async (id: string) => {
    try {
      setLoading(true);
      setNotFound(false);
      const { data } = await axios.get<Ticket>(`${API_URL}/${id}`, {
        withCredentials: true,
      });

      setTicket(data);
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

  return { getTicket, loading, ticket, notFound };
};
