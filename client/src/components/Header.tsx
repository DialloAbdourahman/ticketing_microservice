import { Link } from "react-router-dom";
import { AuthInitialStateType } from "../store/auth.slice";
import { useSelector } from "react-redux";
import { useSignOut } from "../api/AuthApi";

const Header = () => {
  const { user }: AuthInitialStateType = useSelector(
    (state: any) => state.authSlice as AuthInitialStateType
  );
  const { signOut } = useSignOut();

  return (
    <header className="">
      <h1>Ticketing.dev</h1>
      {user ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <>
          {" "}
          <Link to={"/auth/signin"}>signin</Link>
          <Link to={"/auth/signup"}>signup</Link>
        </>
      )}
    </header>
  );
};

export default Header;
