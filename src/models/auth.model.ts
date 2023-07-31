import { DataResponse } from "./common.model";

export interface FormLoginByEmail{
    email: string;
    password: string;
}

export interface FormRequestOtp{
    phone: string;
}

export interface FormLoginByPhoneNumber{
    phone: string;
    otp_token: string;
    otp: string;
}

export interface FormRegisterBasic{
    first_name?: string;
    last_name?: string;
    email?: string;
    firebase_token?: string;
    phone?: string;
    otp_token?: string;
    otp?: string;
    gender?: string;
    birthday?: string;
    password?: string;
}

export interface FormSocialLogin{
    firebase_token: string;
}

export interface FormCheckMailExist{
    email: string;
    firebase_token?: string;
}

export interface DataResponseLoginEmail extends DataResponse<any>{
    access_token?: string;
    refresh_token?: string;
}

export interface DataResponseLoginByPhoneNumber extends DataResponse<any>{
    access_token?: string;
    refresh_token?: string;
}

export interface DataResponseRequestOtp extends DataResponse<any>{
    token?: string;
}