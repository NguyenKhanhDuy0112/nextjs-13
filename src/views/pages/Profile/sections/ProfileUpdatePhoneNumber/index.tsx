"use client";
import Input from "@/components/Input";
import { MessageValidate } from "@/constants";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { RegExp } from '@/utilities/utilities';
import moment from "moment";
import { useForm  } from 'react-hook-form';

interface FormUpdatePhoneNumber {
    phone?: string;
}

function ProfileUpdatePhoneNumber() {
    const {t } = useTranslation();
    const schema = yup.object().shape({
        phone: yup.string().required(MessageValidate.Message_Required_Field).matches(RegExp.PhoneNumber, MessageValidate.Message_Invalid_PhoneNumber),
    });

    const { control, register, watch, handleSubmit, formState: { errors }, getValues, setValue, setError, clearErrors } = useForm<FormUpdatePhoneNumber>({
        resolver: (yupResolver(schema) as any),
    });


    return ( 
        <article className={`profile__info`}>
            <div className="profile__info-title">
                <h2>{t('SCR_PERSONAL_INFORMATION')}</h2>
            </div>
            <div className="profile__info-content">
                <div className="profile__info-form">
                    <div className="profile__info-form-group">
                        <div className="profile__info-form-field">
                            <Input
                                label={`${t('SCR_GIFT_RECEIVER_PHONE')}`}
                                type="text"
                                placeholder={`*${t('SCR_GIFT_RECEIVER_PHONE')}`}
                                error={errors.phone}
                                register={register('phone')}
                                errorMessage={`${t(`${errors.phone?.message}`, { name: t("SCR_GIFT_RECEIVER_PHONE"), max: 30 })}`}
                            />
                        </div>
                        <div className="profile__info-form-field"></div>
                    </div>
                    <div className="profile__info-form-group">
                            <div className="profile__info-form-field">
                                <button onClick={() => console.log('')} className='btn profile__info-form-btn-edit'>
                                    {t('SCR_SAVE')}
                                </button>
                            </div>
                            <div className="profile__info-form-field">
                                <div></div>
                            </div>  
                        </div>
                </div>
            </div>
        </article>
     );
}

export default ProfileUpdatePhoneNumber;