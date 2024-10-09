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
      <Link to={"/"}>
        <h1>Ticketing.dev</h1>
      </Link>

      {user ? (
        <>
          <Link to={"/new-ticket"}>Sell tickets</Link>
          <Link to={"/orders"}>See orders</Link>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <Link to={"/auth/signin"}>signin</Link>
          <Link to={"/auth/signup"}>signup</Link>
        </>
      )}
      <div>Home : {user ? user.email : "Not authenticated"}</div>
    </header>
  );
};

export default Header;
