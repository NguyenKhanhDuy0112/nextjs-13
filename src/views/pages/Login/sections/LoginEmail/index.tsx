
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { CookieStorageKey, MessageValidate } from '@/constants';
import { LoginPhoneNumberAndEmail } from '../LoginDesktop';
import { RegExp, handleRedirectAfterLogin } from '@/utilities/utilities';

//ACTION REDUX
import { login } from '@/redux/modules/authSlice/authSlice';

//HOOKS
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCookieStorage } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

//COMPONENTS
import Input from '@/components/Input';
import Alert from '@/components/Aleart';

//ICONS
import BackIc from '@/assets/icons/BackIc';

//SERVICES
import { useLoginByEmailApiMutation } from '@/services/authService';

interface FormLoginByEmail {
    email: string;
    password: string;
    remeber_me?: boolean;
}

interface LoginEmailProps{
    onChangeTypeLogin: (type: string) => void;
}

function LoginEmail(props: LoginEmailProps) {
    const { onChangeTypeLogin } = props;

    //STATES
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    //HOOKS
    const { setCookie, removeCookie } = useCookieStorage();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    //SERVICES
    const [loginByEmailApi, { isLoading }] = useLoginByEmailApiMutation();

    const schema = yup.object().shape({
        email: yup.string()
        .required(MessageValidate.Message_Required_Field)
        .max(255, MessageValidate.Message_Invalid_Email)
        .test("mail_latin", MessageValidate.Message_Invalid_Email, (value) => {
            return RegExp.Email.test(value);
        })
        .email(MessageValidate.Message_Invalid_Email),
        password: yup.string().required(MessageValidate.Message_Required_Field),
    });
    
    const { register, handleSubmit, formState: { errors }, watch} = useForm<FormLoginByEmail>({
        resolver: yupResolver(schema),
    });
    
    const email = watch('email')
    const password = watch('password')

    useEffect(() => {
        setLoginErrorMessage('');
    },[email, password])
    
    const onSubmitHandler = (values: FormLoginByEmail) => {
        (async () => {
            try{
                const {access_token, refresh_token } = await loginByEmailApi({
                    email: values?.email, 
                    password: values?.password
                }).unwrap();

                if(access_token){
                    if(values?.remeber_me){
                        setCookie(CookieStorageKey.KEEP_ME_LOGIN_KEY, { email: values.email, password: values.password })
                    }

                    dispatch(login({refresh_token: refresh_token || "", access_token: access_token || "", otp_token: ''}));
                    handleRedirectAfterLogin(router);
                    removeCookie(CookieStorageKey.REDIRECT_URL_4P);
                }else{
                    setLoginErrorMessage(t(MessageValidate.Message_Incorrect_Email_And_Password))
                }
            }catch(err){
                setLoginErrorMessage(t(MessageValidate.Message_Incorrect_Email_And_Password))
            }
        })()
    };

    return ( 
        <>
            <h2 className="login-desktop-title">
                {t("SCR_LOGIN_TITLE")}
                <button onClick={() => router.back()} className="login-desktop-back-btn"><BackIc/></button>
            </h2>
            <Alert type='error' message={loginErrorMessage}/>
            <div>
                <div className='login-form-item'>
                    <Input
                        type="text"
                        placeholder={`*${t("SCR_EMAIL_ADDRESS")}`}
                        error={errors.email}
                        register={register('email')}
                        errorMessage={`${t(`${errors?.email?.message}`, { name: t("SCR_EMAIL_ADDRESS") })}`}
                    />
                </div>
                <div className='login-form-item'>
                    <Input
                        type="password"
                        placeholder={`*${t("SCR_INPUT_PASSWORD")}`}
                        error={errors.password}
                        errorMessage={`${t(`${errors?.password?.message}`, { name: t("SCR_INPUT_PASSWORD") })}`}
                        register={register('password')}
                    />
                </div>
                <div className='login-form-item'>
                    <div className='d-flex justify-between items-center'>
                        <div className='login-form-item-checkbox'>
                            <label className="container-checkox">
                                <input {...register('remeber_me')} id="remember_me" type="checkbox"/>
                                <div className="checkmark"></div>
                            </label>     
                            <label className='container-checkbox-label' htmlFor='remember_me'>{t("SCR_REMEMBER_ME")}</label>
                        </div>  
                        <div>
                            <Link className='login-form-item-link' href={'/forgot-password'}>{`${t("SCR_FORGET_PASSWORD")}?`}</Link>
                        </div> 
                    </div>
                </div>

                <div className='login-form-bottom text-align-start'>
                    <p onClick={() => onChangeTypeLogin(LoginPhoneNumberAndEmail.PhoneNumber as string)} className='login-form-bottom-hightlight text-align-start mb-0-5'>
                        {t('SCR_SIGN_IN_PHONE_NUMBER', 'Sign in with Phone number')}
                    </p>
                </div>
                <div className='d-flex items-center justify-center'>
                    <button onClick={handleSubmit(onSubmitHandler)} className={`btn btn-login ${isLoading ? 'loading' : ''}`}>
                        {t('SCR_LOGIN')}
                    </button>
                </div>
            </div>
        </>
     );
}

export default LoginEmail;