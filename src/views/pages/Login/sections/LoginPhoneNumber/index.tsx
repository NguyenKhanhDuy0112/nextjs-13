import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegExp, handleRedirectAfterLogin } from '@/utilities/utilities';
import { CookieStorageKey, MessageValidate } from '@/constants';
import { t } from 'i18next';

//MODELS
import { LoginPhoneNumberAndEmail } from '../LoginDesktop';

//REDUX
import { login, updateAuthState } from '@/redux/modules/authSlice/authSlice';

//HOOKS
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { useAuth, useCookieStorage, useModal } from '@/hooks';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

//ICONS
import BackIc from '@/assets/icons/BackIc';

//SERVICES
import { useLoginByPhoneNumberApiMutation, useRequestOtpApiMutation } from '@/services/authService';

//COMPONENTS
import ModalVerifyOtp from '@/components/ModalVerifyOtp';
import Alert from '@/components/Aleart';
import Input from '@/components/Input';

interface FormLoginByPhoneNumber {
    phoneNumber: string;
}

interface LoginPhoneNumberProps{
    onChangeTypeLogin: (type: string) => void;
}

function LoginPhoneNumber(props: LoginPhoneNumberProps) {
    const { onChangeTypeLogin } = props;

    //STATES
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [otpErrorMessage, setOtpErrorMessage] = useState('');

    //HOOKS
    const { otp_token } = useAuth();
    const dispatch = useAppDispatch();
    const { removeCookie } = useCookieStorage();
    const { visible: showPopupOtp, toggle: togglePopupOtp } = useModal();
    const router = useRouter();

    //SERVICES
    const [requestOtpApi, { isLoading: isLoadingRequestOtp }] = useRequestOtpApiMutation();
    const [verifyOtpApi, { isLoading: isLoadingByPhoneNumber }] = useLoginByPhoneNumberApiMutation();

    const schema = yup.object().shape({
        phoneNumber: yup.string().required(MessageValidate.Message_Required_Field).matches(RegExp.PhoneNumber, MessageValidate.Message_Invalid_PhoneNumber),
    });
    
    const { getValues, register, handleSubmit, formState: { errors }, watch} = useForm<FormLoginByPhoneNumber>({
        resolver: yupResolver(schema),
    });

    const phoneNumber = watch('phoneNumber');

    useEffect(() => {
        setLoginErrorMessage('');
    },[phoneNumber])
    
    const onSubmitHandler = (values: FormLoginByPhoneNumber) => {
        (async () => {
            try{
                const { token } = await requestOtpApi({phone: values?.phoneNumber}).unwrap();
                if(token){
                    dispatch(updateAuthState({ otp_token: token }))
                    togglePopupOtp();
                }else{
                    setLoginErrorMessage(t(MessageValidate.Message_Error_Server))
                }
            }catch(err){
                setLoginErrorMessage(t(MessageValidate.Message_Error_Server))
            }
        })()
    };

    const handleVerifyOtp = (otpCode: string) => {
        (async () => {
            try{
                const { access_token, refresh_token } = await verifyOtpApi({
                    otp: otpCode, 
                    otp_token: otp_token || "", 
                    phone: getValues('phoneNumber')
                }).unwrap();

                if(access_token){
                    dispatch(login({otp_token: '', access_token:access_token, refresh_token: refresh_token}))
                    removeCookie(CookieStorageKey.REDIRECT_URL_4P);
                    togglePopupOtp();
                    handleRedirectAfterLogin(router);
                }else{
                    setOtpErrorMessage(t(MessageValidate.Message_OTP_Code_Expired_Or_Invalid))
                }
            }catch(err){
                setOtpErrorMessage(t(MessageValidate.Message_OTP_Code_Expired_Or_Invalid))
            }
        })()
    }

    const handleResendCode = () => {
        console.log("Resend code.");
    }

    return ( 
       <>
         <article>
            <h2 className="login-desktop-title">
                {t('SCR_LOGIN_TITLE')}
                <button onClick={() => router.back()} className="login-desktop-back-btn"><BackIc/></button>
            </h2>
            <div className='mt-1'>
                <Alert type='error' message={loginErrorMessage}/>
            </div>
            <div className='mt-1'>
                <div className='login-form-item'>
                    <Input
                        type="text"
                        placeholder={`*${t('SCR_GIFT_RECEIVER_PHONE')}`}
                        error={errors.phoneNumber}
                        register={register('phoneNumber')}
                        errorMessage={`${t(`${errors?.phoneNumber?.message}`, { name: t("SCR_GIFT_RECEIVER_PHONE") })}`}
                    />
                </div>
                <div className='login-form-bottom mb-1 text-align-start'>
                    <p 
                        onClick={() => onChangeTypeLogin(LoginPhoneNumberAndEmail.Email as string)} 
                        className='login-form-bottom-hightlight text-align-start mb-0-5'
                    >
                        {t('SCR_SIGN_IN_EMAIL', 'Sign in with Email')}
                    </p>
                </div>
                <div className='d-flex items-center justify-center'>
                    <button onClick={handleSubmit(onSubmitHandler)} className={`btn btn-login mt-0 ${isLoadingRequestOtp ? 'loading' : ''}`}>
                        {t('SCR_LOGIN')}
                    </button>
                </div>
            </div>
        </article>

        <ModalVerifyOtp
            show={showPopupOtp}
            onVerifyCode={handleVerifyOtp}
            onClose={togglePopupOtp}
            phoneNumber={getValues('phoneNumber')}
            onResendCode={handleResendCode}
            errorMessage={otpErrorMessage}
            onSetErrorMessage={setOtpErrorMessage}
            isLoading={isLoadingByPhoneNumber}
        />
       </>
        
        
     );
}

export default LoginPhoneNumber;