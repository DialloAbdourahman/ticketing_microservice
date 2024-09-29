import { useEffect } from "react";
import { useGetCurrentUser } from "./api/AuthApi";
import Router from "./components/Router";
import { useSelector } from "react-redux";
import { AuthInitialStateType } from "./store/auth.slice";

function App() {
  const { getCurrentUser } = useGetCurrentUser();
  const { loadingUser }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (loadingUser) {
    return <h1>Loading...</h1>;
  }

  return <Router />;
}

export default App;
