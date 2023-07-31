export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDbFXVnMR3zoq3UT2U8D5lU8yEJiLcVpSA",
    authDomain: "map-4ps-prod.firebaseapp.com",
    databaseURL: "https://map-4ps-prod.firebaseio.com",
    projectId: "map-4ps-prod",
    storageBucket: "map-4ps-prod.appspot.com",
    messagingSenderId: "1074448014141",
    appId: "1:1074448014141:web:2eed645bf6215f3a518354",
    measurementId: "G-79TH6JNP6V",
};

export enum MessageValidate {
    Message_Required_Field = "SCR_REQUIRED_ERROR",
    Message_Invalid_Email = "SCR_THE_EMAIL_ADDRESS_IS_INVALID",
    Message_Invalid_PhoneNumber = "SCR_THE_PHONE_NUMBER_IS_INVALID",
    Message_Exist_Email = "SCR_EMAIL_EXISTED",
    Message_Incorrect_Email_And_Password = "SCR_INCORRECT_EMAIL_AND_PASSWORD",
    Message_Already_Userd_PhoneNumber = "SCR_THIS_PHONE_NUMBER_IS_ALREADY_USERD",
    Message_OTP_Code_Expired_Or_Invalid = "SCR_THE_CODE_IS_INVALID_OR_EXPIRED",
    Message_Max_Length = "SCR_MAX_LENGTH_STRING",
    Message_Length_Password = "SCR_PASSWORD_LENGTH_INVALID",
    Message_Error_Server = "CSA_COMMON_ERROR_PROBLEMS",
    Message_Match_Password = "SCR_THE_TWO_PASSWORD_ARE_MISMATCHED",
}

export enum QueryParamsType {
    ProfileType = 'ProfileType'
}

export enum RouteType {
    Profile = '/profile',
    Login = '/login',
    Register = '/register'
}

export enum Breakpoint {
    XS_SCREEN = 576,
    MD_SCREEN = 768,
    LG_SCREEN = 992,
    XL_SCREEN = 1024,
    XXL_SCREEN = 1200,
    XXXL_SCREEN = 1600,
}

export enum MEDIA_LINKS {
  Menu_PDF = "https://drive.google.com/file/d/1UUXhBymZv8xP5F91aCkRXM2ZWy-tAfwq/view?usp=sharing",
  Reheating_Video = "https://www.youtube.com/watch?v=AZUze4uzlqw&ab_channel=Pizza4P%27s",
  Pizza_Meditation = "https://www.youtube.com/watch?v=JBVVX1VxzZ8&ab_channel=Pizza4P%27s",
  Facebook = "https://www.facebook.com/Pizza4Ps",
  Instagram = "https://www.instagram.com/pizza4ps/",
  Spotify = "https://open.spotify.com/user/g8afthys5iltk1zjjvqdwi5o3?si=DrJOlp6URlmLpFt1rxDAGg",
};

export enum OUTSIDE_LINK {
    URL_INVOICE_REDIRECT = "https://sit-receipt.pizza4ps.io/",
    URL_DELI_REDIRECT = "https://uat-deli-v2-consumer.pizza4ps.io"
}