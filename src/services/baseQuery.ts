import { CookieStorageKey, StatusCodeApi } from '@/constants';
import { env } from '@/constants/env.constant';
import { login, logout } from '@/redux/modules/authSlice/authSlice';
import { cookiesStorage } from '@/utilities/cookieStorage';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export const baseQueryWithoutToken = fetchBaseQuery({
  baseUrl: `${env.API_ENDPOINT}`,
});

export const baseQueryWithToken = fetchBaseQuery({
  baseUrl: `${env.API_ENDPOINT}`,
  prepareHeaders: (headers) => {
    const token = cookiesStorage.get(CookieStorageKey.TOKEN_SHARE)?.replace(/"/g, '');
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  cache: "no-cache",
});

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithReAuth(args, api, extraOptions);
  return result;
};

export const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQueryWithToken(args, api, extraOptions);
  if (result?.error?.status === StatusCodeApi.UNAUTHORIZED) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = cookiesStorage.get(CookieStorageKey.REFRESH_TOKEN_SHARE)?.replace(/"/g, '');
        const refreshResult: any = await baseQueryWithToken(
          { 
            method: 'POST',
            url: '/auth/refresh-token',
            body: {
              refresh_token: refreshToken
            }
          },
          api,
          extraOptions
        );

        if (refreshResult?.data?.access_token) {
          api.dispatch(login({access_token: refreshResult?.data?.access_token, refresh_token: refreshResult?.data?.refresh_token}))
          result = await baseQueryWithToken(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQueryWithToken(args, api, extraOptions);
    }
  }

  return result;
};

