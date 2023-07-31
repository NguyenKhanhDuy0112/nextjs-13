import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { assetsImages } from '@/assets';
import { CookieStorageKey, Gender, MessageValidate, OptionGenders, RouteType, TypeSignup } from '@/constants';
import moment from 'moment';
import { format } from 'date-fns';
import { RegExp, handleRedirectAfterLogin } from '@/utilities/utilities';

//ICONS
import BackIc from '@/assets/icons/BackIc';

//MODELS
import { FormRegisterBasic } from '@/models';

//FIREBASE
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authentication } from '@/configs/firebase/base';

//HOOKS
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller  } from 'react-hook-form';
import { useAuth, useCookieStorage, useModal } from '@/hooks';
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';

//REDUX
import { login, updateAuthState } from '@/redux/modules/authSlice/authSlice';

//COMPONENTS
import Link from 'next/link';
import Input from '@/components/Input';
import DatePicker from "react-datepicker";
import ModalVerifyOtp from '@/components/ModalVerifyOtp';
import CustomSelect from '@/components/CustomSelect';
import Alert from '@/components/Aleart';

//SERVICES
import { 
    useCheckMailExistApiMutation, 
    useRegisterBasicApiMutation, 
    useRequestOtpApiMutation, 
    useSociaLoginApiMutation 
} from '@/services/authService';

interface FormLogin {
    firstName: string;
    lastName: string;
    email: string;
    password: string | null;
    passwordConfirm: string | null;
    phone: string;
    gender: string;
    birthday: Date | null | undefined;
}

function RegisterDesktop() {
    const { t, i18n } = useTranslation();
    const [errorMessageOtp, setErrorMessageOtp] = useState('');
    const [errorMessageRegister, setErrorMessageRegister] = useState('');
    const { typeSignup, email, phone, otp_token, firebase_token } = useAuth();

    //HOOKS
    const { visible: showModalOtp, toggle: toggleModalOtp } = useModal();
    const { setCookieShared, removeCookie } = useCookieStorage();
    const dispatch = useAppDispatch();
    const router = useRouter();

    //SERVICES
    const [requestOtpApi, { isLoading: isLoadingRequestOtp }] = useRequestOtpApiMutation();
    const [registerAccountApi, { isLoading: isLoadingRegisterAccount }] = useRegisterBasicApiMutation();
    const [loginSocialApi] = useSociaLoginApiMutation(); 
    const [checkMailExistApi] = useCheckMailExistApiMutation();

    const schema = yup.object().shape({
        email: yup.string()
            .required(MessageValidate.Message_Required_Field)
            .max(255, MessageValidate.Message_Invalid_Email)
            .test("mail_latin",MessageValidate.Message_Invalid_Email, (value) => {
                    return RegExp.Email.test(value);
            })
            .email(MessageValidate.Message_Invalid_Email),
        firstName: yup.string().required(MessageValidate.Message_Required_Field).max(30, MessageValidate.Message_Max_Length),
        lastName: yup.string().required(MessageValidate.Message_Required_Field).max(30, MessageValidate.Message_Max_Length),
        phone: yup.string().required(MessageValidate.Message_Required_Field).matches(RegExp.PhoneNumber, MessageValidate.Message_Invalid_PhoneNumber),
        password: typeSignup === TypeSignup.Original
            ? yup.string()
                .min(6, MessageValidate.Message_Length_Password)
                .max(50, MessageValidate.Message_Length_Password)
                .required(MessageValidate.Message_Required_Field)
            : yup.string().nullable(),
        passwordConfirm: typeSignup === TypeSignup.Original
            ? yup.string()
                .required(MessageValidate.Message_Required_Field)
                .oneOf([yup.ref("password")], t(MessageValidate.Message_Match_Password))
            : yup.string().nullable(),
                birthday: yup.date().nullable(),
                gender: yup.string().required(MessageValidate.Message_Required_Field)
    });
    
    const { control, register, watch, handleSubmit,formState: { errors } ,getValues, setValue, setError, clearErrors} = useForm<FormLogin>({
        resolver: (yupResolver(schema) as any),
        defaultValues: {
            gender: Gender.Male
        }
    });
    const gender = watch('gender');

    useEffect(() => {
        setValue('email', email || "");
        setValue('phone', phone || "");
    },[email, phone])
    
    const onSubmitHandler = (data: FormLogin) => {
        setErrorMessageRegister('');
        (async () => {
            if(typeSignup === TypeSignup.Original){
                try{
                    await checkMailExistApi({ email: getValues('email') }).unwrap();
                    clearErrors('email');
                }catch(err){
                    setError('email', { message: t(MessageValidate.Message_Exist_Email) });
                    return;
                }
            }

            try{
                const { token } = await requestOtpApi({phone: data?.phone}).unwrap();
                if(token){
                    dispatch(updateAuthState({ otp_token: token }))
                    toggleModalOtp();
                }else{
                    setErrorMessageRegister(t(MessageValidate.Message_Error_Server))
                }
            }catch(err){
                setErrorMessageRegister(t(MessageValidate.Message_Error_Server))
            }
        })()
    };

    const handleAuth = async (auth_data: any) => {
        const user = auth_data.user;
        let token = "";
        setErrorMessageRegister('');

        await user.getIdToken().then(async (result_token: any) => {
          token = result_token;
        });
    
        if(token !== ""){
          dispatch(updateAuthState({ email: user?.email || "", phone: user?.phoneNumber || "", firebase_token: token }))
          try{
            const { access_token, refresh_token } = await loginSocialApi({firebase_token: token}).unwrap();
            
            dispatch(login({refresh_token: refresh_token || "", access_token: access_token || "", otp_token: ''}));
            setCookieShared(CookieStorageKey.TOKEN_SHARE as string, access_token || "");
            setCookieShared(CookieStorageKey.REFRESH_TOKEN_SHARE as string, refresh_token);
            handleRedirectAfterLogin(router);
            removeCookie(CookieStorageKey.REDIRECT_URL_4P);

          }catch(err){
            setErrorMessageRegister(t(MessageValidate.Message_Error_Server));
          }
        }
    };

    const handleSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
            prompt: "select_account"
        });
        signInWithPopup(authentication, provider)
            .then((result) => {
                dispatch(updateAuthState({ typeSignup: TypeSignup.Google }))
                handleAuth(result);
            }).catch((error) => {
                setErrorMessageRegister(t(MessageValidate.Message_Error_Server));
            });
    }
    
    const handleSignInWithFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(authentication, provider)
          .then((result) => {
            dispatch(updateAuthState({ typeSignup: TypeSignup.Facebook }));
            handleAuth(result);
          })
          .catch((error) => {
            setErrorMessageRegister(t(MessageValidate.Message_Error_Server));
          });
    };

    const handleVerifyOtp = (otpCode: string) => {
        (async () => {
            try{
                const body: FormRegisterBasic = {
                    first_name: getValues('firstName') || "",
                    last_name: getValues("lastName") || "",
                    birthday: moment(getValues('birthday')).toISOString(),
                    email: getValues('email') || "",
                    gender: getValues('gender') || "",
                    otp: otpCode,
                    otp_token: otp_token || "",
                    firebase_token: firebase_token,
                    phone: getValues('phone') || "",
                    password: getValues('password') || ""
                }

                if(typeSignup === TypeSignup.Original){
                    delete body?.firebase_token
                }

                if(typeSignup === TypeSignup.Google){  
                    body.email = email || "";
                }

                const { access_token, refresh_token } = await registerAccountApi({...body}).unwrap();

                if(access_token){
                    dispatch(login({otp_token: '', access_token:access_token, refresh_token: refresh_token}));
                    removeCookie(CookieStorageKey.REDIRECT_URL_4P);
                    toggleModalOtp();
                    handleRedirectAfterLogin(router);
                }else{
                    setErrorMessageOtp(t(MessageValidate.Message_OTP_Code_Expired_Or_Invalid))
                }
            }catch(err){
                setErrorMessageOtp(t(MessageValidate.Message_OTP_Code_Expired_Or_Invalid))
            }   
        })()
    }

    const handleCheckMail = (value: string) => {
        const emailRegex = RegExp.Email;

        if (!emailRegex.test(value)) {
            setError('email', { message: MessageValidate.Message_Invalid_Email });
            return;
        }

        if(value){
            (async () => {
                try{
                    await checkMailExistApi({ email: value }).unwrap();
                    clearErrors('email');
                }catch(err){
                    setError('email', { message: t(MessageValidate.Message_Exist_Email) });
                }
            })() 
        }
    }

    const handleResendCode = () => console.log('Resend Code.');

    const selectedGender = useMemo(() => {
        const findGender = OptionGenders?.find(item => (item?.value === gender));
        return {...findGender, label: t(`${findGender?.label}`)}
    },[gender])

    return ( 
        <section className="login-desktop">
            <div className='login-desktop-container'>
                <h2 className="login-desktop-title">
                    {t('SCR_CREATE_AN_ACCOUNT')}
                    <button onClick={() => router.back()} className="login-desktop-back-btn"><BackIc/></button>
                </h2>
                <Alert type='error' message={errorMessageRegister || ""}/>
                <div>
                    <div className='login-form-item'>
                        <Input
                            type="text"
                            placeholder={`*${t('SCR_FIRST_NAME')}`}
                            error={errors.firstName}
                            register={register('firstName')}
                            errorMessage={`${t(`${errors.firstName?.message}`, { name: t("SCR_FIRST_NAME"), max: 30 })}`}
                        />
                    </div>
                    <div className='login-form-item'>
                        <Input
                            type="text"
                            placeholder={`*${t('SCR_LAST_NAME')}`}
                            error={errors.lastName}
                            register={register('lastName')}
                            errorMessage={`${t(`${errors?.lastName?.message}`, { name: t("SCR_LAST_NAME"), max: 30 })}`}
                        />
                    </div>
                    <div className='login-form-item'>
                        <Input
                            type="text"
                            placeholder={`*${t('SCR_EMAIL_ADDRESS')}`}
                            error={errors.email}
                            readOnly={Boolean(typeSignup !== TypeSignup.Original)}
                            register={register('email')}
                            onBlur={handleCheckMail}
                            errorMessage={`${t(`${errors?.email?.message}`, { name: t("SCR_EMAIL_ADDRESS") })}`}
                        />
                    </div>
                    <div className='login-form-item'>
                        <Input
                            type="text"
                            placeholder={`*${t('SCR_GIFT_RECEIVER_PHONE')}`}
                            error={errors.phone}
                            register={register('phone')}
                            readOnly={Boolean(typeSignup !== TypeSignup.Original && phone)}
                            errorMessage={`${t(`${errors?.phone?.message}`, { name: t("SCR_GIFT_RECEIVER_PHONE") })}`}
                        />
                    </div>
                    {
                        typeSignup === TypeSignup.Original
                        &&
                        <div className='login-form-item'>
                            <Input
                                type="password"
                                placeholder={`*${t('SCR_INPUT_PASSWORD')}`}
                                error={errors?.password}
                                register={register('password')}
                                errorMessage={`${t(`${errors?.password?.message}`, { name: t("SCR_INPUT_PASSWORD") })}`}
                            />
                        </div> 
                    }
                    {
                        typeSignup === TypeSignup.Original 
                        &&
                        <div className='login-form-item'>
                            <Input
                                type="password"
                                placeholder={`*${t('SCR_CONFIRM_PASSWORD')}`}
                                error={errors?.passwordConfirm}
                                register={register('passwordConfirm')}
                                errorMessage={`${t(`${errors?.passwordConfirm?.message}`, { name: t("SCR_CONFIRM_PASSWORD")})}`}
                            />
                        </div>
                    }
                    <div className='login-form-item'>
                         <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    field={field}
                                    options={OptionGenders}
                                    placeholder={'Select gender'}
                                    setValue={(value: any) => setValue('gender', value)}
                                    error={errors?.gender}
                                    value={selectedGender || null}
                                />
                            )}
                        />
                        
                    </div>
                    <div className='login-form-item'>
                        <Controller
                            name="birthday"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    locale={i18n.language}
                                    selected={field.value}
                                    onChange={(date: Date | null) => field.onChange(date)}
                                    placeholderText={t("SCR_BIRTHDAY")}
                                    dateFormat="yyyy-MM-dd"
                                    maxDate={moment().toDate()}
                                    value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                />
                            )}
                        />
                    </div>
                    <div className='d-flex items-center justify-center'>
                        <button onClick={handleSubmit(onSubmitHandler)} className={`btn btn-login ${isLoadingRequestOtp ? 'loading' : ''}`} type="submit">{t('SCR_REGISTER')}</button>
                    </div>
                    <div className='login-form-bottom mt-1-5'>
                        <p className='login-form-bottom-des'>{t('SCR_REGISTER_AGREE_TO_TC')} <Link href={'#'}>{t('SCR_INFOR_CUSTOMER_TERMS_CONDITIONS')}</Link></p>
                    </div>
                </div>
                <div className='login-form-social-title'>
                    <span>{t('SCR_OR')}</span>
                </div>
                <div className='login-form-social'>
                    <button onClick={handleSignInWithFacebook} type="button" className='login-form-social-btn'>
                        <img className='login-form-social-btn-img' src={assetsImages.facebookLogo.src}/> 
                        <span className='login-form-social-btn-txt'>{t('SCR_SIGN_UP_FACEBOOK')}</span>
                    </button>
                    <button onClick={handleSignInWithGoogle} type="button" className='login-form-social-btn'>
                        <img className='login-form-social-btn-img' src={assetsImages.googleLogoNormal.src}/> 
                         <span className='login-form-social-btn-txt'>{t('SCR_SIGN_UP_GOOGLE')}</span>
                    </button>
                </div>
                <div className='login-form-bottom'>
                    <p className='login-form-bottom-des'>{t("SCR_ALREADY_HAVE_AN_ACCOUNT")} <Link href={`${RouteType.Login}`}>{t("SCR_LOGIN")}</Link></p>
                </div>
            </div>
            
            <ModalVerifyOtp
                show={showModalOtp}
                onClose={toggleModalOtp}
                onResendCode={handleResendCode}
                onVerifyCode={handleVerifyOtp}
                phoneNumber={getValues('phone')}
                isLoading={isLoadingRegisterAccount}
                errorMessage={errorMessageOtp}
                onSetErrorMessage={setErrorMessageOtp}
            />
        </section>
    );
}

export default RegisterDesktop;