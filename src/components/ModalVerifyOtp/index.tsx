import { FormEvent, useState } from "react";
import Modal from "../Modal";
import Alert from "../Aleart";
import OtpInput from "../OtpInput";
import { useTranslation } from "react-i18next";

interface ModalVerifyOtpProps{
    phoneNumber: string;
    show: boolean;
    errorMessage?: string;
    isLoading?: boolean;
    onClose: () => void;
    onVerifyCode: (otpCode: string) => void;
    onResendCode: () => void;
    onSetErrorMessage?: (errorMessage: string) => void;
}

function ModalVerifyOtp(props: ModalVerifyOtpProps) {
    const { phoneNumber,  show, errorMessage, isLoading, onClose , onVerifyCode, onResendCode, onSetErrorMessage } = props;
    const [otpCode, setOtpCode] = useState('');
    const { t } = useTranslation();

    const handleVerifyOtp = () => {
        if(otpCode?.length < 6) return;
        onVerifyCode(otpCode);
    }

    return ( 
        <Modal
            show={show}
            onClose={onClose}
        >
            <div className="modal-otp">
                <h2 className="modal-otp-title">{t('SCR_ENTER_VERIFY_PHONE')}</h2>
                <div className='modal-otp-form mt-1'>
                    <p className='modal-otp-form-des text-align-start'>
                        {t('SCR_ENTER_PHONE_FOR_OTP')} {" "}
                        <span className='modal-otp-form-des-hightlight'>{phoneNumber}</span>
                    </p>
                </div>
                <div className='mt-1'>
                    <OtpInput onChange={() => onSetErrorMessage && onSetErrorMessage('')} onComplete={setOtpCode}/>
                    <Alert type='error' message={errorMessage || ""}/>
                    <div className='d-flex items-center justify-center'>
                        <button onClick={handleVerifyOtp} disabled={otpCode.length < 6} className={`btn btn-login mt-1 ${isLoading ? 'loading' : ''}`}>
                            {t('SCR_VERIFY')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
     );
}

export default ModalVerifyOtp;