import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithoutToken } from './baseQuery';
import { 
  DataResponse,
  DataResponseLoginByPhoneNumber,
  DataResponseLoginEmail,
  DataResponseRequestOtp,
  FormCheckMailExist, 
  FormLoginByEmail, 
  FormLoginByPhoneNumber, 
  FormRegisterBasic, 
  FormRequestOtp, 
  FormSocialLogin, 
} from '@/models';

export const AuthServiceAPI = createApi({
  reducerPath: 'AuthServiceAPI',
  baseQuery: baseQueryWithoutToken,
  endpoints: (builder) => ({
    loginByEmailApi: builder.mutation<DataResponseLoginEmail, FormLoginByEmail>({
      query: (body) => ({
        url: '/auth/basic-login',
        body,
        method: 'POST',
      }),
    }),
    loginByPhoneNumberApi: builder.mutation<DataResponseLoginByPhoneNumber, FormLoginByPhoneNumber>({
      query: (body) => ({
        url: '/auth/otp-login',
        body,
        method: 'POST',
      }),
    }),
    requestOtpApi: builder.mutation<DataResponseRequestOtp, FormRequestOtp>({
      query: (body) => ({
        url: '/auth/request-otp',
        body,
        method: 'POST',
      }),
    }),
    registerBasicApi: builder.mutation<DataResponseLoginByPhoneNumber, FormRegisterBasic>({
      query: (body) => ({
        url: '/auth/basic-register',
        body,
        method: 'POST',
      }),
    }),
    sociaLoginApi: builder.mutation<DataResponseLoginByPhoneNumber, FormSocialLogin>({
      query: (body) => ({
        url: '/auth/social-login',
        body,
        method: 'POST',
      }),
    }),
    checkMailExistApi: builder.mutation<DataResponse<any>, FormCheckMailExist>({
      query: (body) => ({
        url: '/auth/check-email-exist',
        body,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useCheckMailExistApiMutation,
  useLoginByEmailApiMutation,

  useRequestOtpApiMutation,
  useLoginByPhoneNumberApiMutation,

  useSociaLoginApiMutation,

  useRegisterBasicApiMutation,
} = AuthServiceAPI;
