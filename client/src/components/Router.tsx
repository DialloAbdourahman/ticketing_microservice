import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Header from "./Header";
import NewTicket from "../pages/NewTicket";
import SingleTicket from "../pages/SingleTicket";
import SingleOrder from "../pages/SingleOrder";
import OrdersList from "../pages/OrdersList";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth">
          <Route path="signup" element={<Signup />} />
          <Route path="signin" element={<Signin />} />
        </Route>
        <Route path="/new-ticket" element={<NewTicket />} />
        <Route path="/single-ticket/:id" element={<SingleTicket />} />
        <Route path="/single-order/:id" element={<SingleOrder />} />
        <Route path="/orders" element={<OrdersList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
