import { useSelector } from "react-redux";
import { AuthInitialStateType } from "../store/auth.slice";

const Home = () => {
  const { user }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );
  return <div>Home : {user ? user.email : "Not authenticated"}</div>;
};

export default Home;
