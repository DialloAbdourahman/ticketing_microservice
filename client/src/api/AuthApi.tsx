import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorResponseType } from "../types/Errors";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoadingUser, setUser } from "../store/auth.slice";

const API_URL = "/api/users";

export type AuthResponseType = {
  email: string;
  id: string;
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState<ErrorType[]>([]);
  const navigate = useNavigate();
  const { getCurrentUser } = useGetCurrentUser();

  const signUp = async (email: string, password: string) => {
    if (!email || !password) {
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
      const { data } = await axios.post<AuthResponseType>(`${API_URL}/signup`, {
        email,
        password,
      });
      toast.success("Signed up successfully, you will soon be redirected.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });
      setTimeout(async () => {
        navigate("/");
        await getCurrentUser();
      }, 3000);
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

  return { loading, signUp };
};

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getCurrentUser } = useGetCurrentUser();

  const signin = async (email: string, password: string) => {
    if (!email || !password) {
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
      const { data } = await axios.post<AuthResponseType>(
        `${API_URL}/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      toast.success("Signed in successfully, you'll soon be redirected.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });
      setTimeout(async () => {
        navigate("/");
        await getCurrentUser();
      }, 3000);
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

  return { loading, signin };
};

export type GetCurrentUserResponseType = {
  currentUser: AuthResponseType | null;
};

export const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(setLoadingUser(true));
      const { data } = await axios.get<GetCurrentUserResponseType>(
        `${API_URL}/currentuser`,
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(data.currentUser));
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
      dispatch(setLoadingUser(false));
    }
  };

  return { getCurrentUser };
};

export const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getCurrentUser } = useGetCurrentUser();

  const signOut = async () => {
    try {
      setLoading(true);
      await axios.post<AuthResponseType>(`${API_URL}/signout`);
      toast.success("Signed out successfully, you'll soon be redirected.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });
      setTimeout(async () => {
        navigate("/");
        await getCurrentUser();
      }, 3000);
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

  return { loading, signOut };
};
