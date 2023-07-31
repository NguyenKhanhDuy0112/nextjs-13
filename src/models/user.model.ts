import { Gender } from "@/constants";
import { Obj } from "./types";

export enum CustomerEmailTypeEnum{
  Others = 'others',
  UserName_Password = 'mail',
  Social = 'sso'
}

export interface UserProfileUpdate{
    first_name: string;
    last_name: string;
    birthday: string;
    gender: string;
    mail: CustomerEmailInfo[]
}

export interface CustomerEmailInfo{
    created_at?: string;
    customer_id?: string;
    email?: string;
    firebase_id?: string;
    id?: string;
    is_default?: boolean;
    password?: string;
    type?: CustomerEmailTypeEnum;
    updated_at?: string;
}

export interface UserProfile{
    birthday?: string;
    created_at?: string;
    first_name?: string;
    last_name?: string;
    gender?: Gender | null;
    id?: string;
    last_active?: string;
    locations?: any;
    phone?: string;
    customer_email_info?: CustomerEmailInfo[];
    updated_at?: string;
}