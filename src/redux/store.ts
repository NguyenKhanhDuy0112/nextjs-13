import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import rootReducer from "@/redux/modules";

import { AuthServiceAPI } from '@/services/authService';
import { UserServiceApi } from '@/services/userService';

export const store = configureStore({
  reducer: {
    [AuthServiceAPI.reducerPath]: AuthServiceAPI.reducer,
    [UserServiceApi.reducerPath]: UserServiceApi.reducer,
    rootReducer
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        AuthServiceAPI.middleware,
        UserServiceApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

