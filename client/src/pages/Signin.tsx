import { useState } from "react";
import { useSignIn } from "../api/AuthApi";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signin, loading } = useSignIn();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signin(email, password);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <h1>Signin</h1>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button>Signin</button>
    </form>
  );
};

export default Signin;
