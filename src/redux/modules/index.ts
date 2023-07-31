import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice/authSlice";
import profileSlice from "./profileSlice/profileSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  profile: profileSlice
});

export default rootReducer;
