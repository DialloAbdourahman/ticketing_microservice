import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";

const store = configureStore({
  reducer: {
    authSlice: authReducer,
  },
});

export default store;
