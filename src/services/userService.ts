import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefreshToken } from './baseQuery';
import { DataResponse, DataResponseLoginByPhoneNumber, UserProfile, UserProfileUpdate } from '@/models';
import { cookiesStorage } from '@/utilities/cookieStorage';
import { CookieStorageKey } from '@/constants';

export const UserServiceApi = createApi({
  reducerPath: 'UserServiceApi',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    getUserProfileApi: builder.query<UserProfile, void>({
        query: () => ({
          url: `/profile`,
          method: "GET",
        }),
    }),
    refreshTokenApi: builder.mutation<DataResponseLoginByPhoneNumber, void>({
      query: (body) => ({
        url: '/auth/refresh-token',
        body: { 
          refresh_token: 'hello',
         },
        method: 'POST',
      }),
    }),
    updateUserProfileApi: builder.mutation<UserProfile, UserProfileUpdate>({
        query: (body) => ({
          url: '/profile',
          body,
          method: 'PUT',
        }),
      }),
    }),
    
});

export const {

    useGetUserProfileApiQuery,
    useLazyGetUserProfileApiQuery,

    useUpdateUserProfileApiMutation,

    useRefreshTokenApiMutation,

} = UserServiceApi;
