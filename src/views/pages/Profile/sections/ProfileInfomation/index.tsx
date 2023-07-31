"use client";
import * as yup from 'yup';
import { Gender, MessageValidate, OptionGenders, ProfileRouteType, QueryParamsType, RouteType } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { RegExp } from '@/utilities/utilities';
import moment from 'moment';

//HOOKS
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller  } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hook';

//MODELS
import { CustomerEmailInfo, CustomerEmailTypeEnum } from '@/models';

//REDUX
import { updateProfile } from '@/redux/modules/profileSlice/profileSlice';

//COMPONENTS
import Input from "@/components/Input";
import CustomSelect from '@/components/CustomSelect';
import DatePicker from "react-datepicker";
import Radio from '@/components/Radio';

//SERVICES
import { useGetUserProfileApiQuery, useUpdateUserProfileApiMutation } from '@/services/userService';
import useProfile from '@/hooks/useProfile';
import ModalVerifyOtp from '@/components/ModalVerifyOtp';
import { useModal } from '@/hooks';

interface FormProfile {
    emails?: CustomerEmailInfo[];
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    birthday: Date | null | undefined;
}

function ProfileInfomation() {
    const { t, i18n } = useTranslation();

    //STATE
    const [emails, setEmails] = useState<CustomerEmailInfo[]>([]);

    //HOOKS
    const searchParams = useSearchParams();
    const { push } = useRouter();
    const profileUser = useProfile();
    const dispatch = useAppDispatch();
    const { visible: showModalOtp, toggle: onToggleModalOtp } = useModal();

    //SERVICES
    const [updateProfileApi, { isLoading: isLoadingUpdateProfile }] = useUpdateUserProfileApiMutation();
    const { data, refetch } = useGetUserProfileApiQuery();

    const schema = yup.object().shape({
        emails: yup.array().of(
            yup.object().shape({
                id: yup.string(),
                is_default: yup.bool(),
                email: yup.string()
                    .required(MessageValidate.Message_Required_Field)
                    .max(255, MessageValidate.Message_Invalid_Email)
                    .test("mail_latin",MessageValidate.Message_Invalid_Email, (value) => {
                        return RegExp.Email.test(value);
                    })
                    .email(MessageValidate.Message_Invalid_Email),
            })
        ),
        birthday: yup.date().required(MessageValidate.Message_Required_Field),
        gender: yup.string().required(MessageValidate.Message_Required_Field),
        first_name: yup.string().required(MessageValidate.Message_Required_Field).max(30, MessageValidate.Message_Max_Length),
        last_name: yup.string().required(MessageValidate.Message_Required_Field).max(30, MessageValidate.Message_Max_Length),
        phone: yup.string(),
    });

    const { control, register, watch, handleSubmit, formState: { errors }, getValues, setValue, setError, clearErrors } = useForm<FormProfile>({
        resolver: (yupResolver(schema) as any),
        defaultValues: {
            birthday: moment().toDate()
        }
    });

    useEffect(() => {
        dispatch(updateProfile({ ...data }));
    },[data])

    useEffect(() => {
        setValue('first_name', data?.first_name || "");
        setValue('last_name', data?.last_name || "");
        setValue('phone', data?.phone || "");
        setValue('gender', data?.gender || "");
        setValue('birthday',  data?.birthday ? new Date(data?.birthday) : null);
        
        const defaultEmailIndex = data?.customer_email_info?.findIndex(email => email?.type !== CustomerEmailTypeEnum.Others);
        let newEmails = data?.customer_email_info ? [...data?.customer_email_info] : [];

        if (defaultEmailIndex !== -1) {
            const defaultEmail = newEmails?.splice(defaultEmailIndex || 0, 1)[0];
            newEmails.unshift(defaultEmail);
        }
        
        if(newEmails?.length){
            setValue('emails', newEmails);
            setEmails(newEmails);
        }else{
            newEmails = [{id: '', email: '', type: CustomerEmailTypeEnum.Others, is_default: true}];
            setValue('emails', newEmails);
            setEmails(newEmails);
        }
    },[data])

    const genderValue = watch('gender');

    const handleFetchUpdateProfile = (payload: FormProfile) => {
        (async () => {
            const bodyUpdateProfile = {
                birthday: payload?.birthday ? moment(payload?.birthday).toISOString() : "",
                first_name: payload?.first_name,
                last_name: payload?.last_name,
                gender: payload?.gender as Gender,
            }
    
            await updateProfileApi({
                ...bodyUpdateProfile,
                mail: payload?.emails || [],
            }).unwrap();
    
            refetch();
            push(`${RouteType.Profile}?${QueryParamsType.ProfileType}=${ProfileRouteType.ViewProfile}`);
        })()
    }

    const handleUpdateProfile = (payload: FormProfile) => {
        (async () => {
            if(payload?.phone !== data?.phone){
                onToggleModalOtp();
                return;
            }
            handleFetchUpdateProfile(payload);
        })()
    };

    const handleAddEmail = () => {
        const newEmails: CustomerEmailInfo[] = [...(getValues('emails') || []), {id: '', email: '', is_default: false, type: CustomerEmailTypeEnum.Others}];
        setValue('emails',  newEmails);
        setEmails(newEmails)
    }

    const handleDeleteEmail = (index: number) => {
        let newEmails: CustomerEmailInfo[] = [...(getValues('emails') || [])];
        newEmails.splice(index, 1);
        setValue('emails', newEmails);
        setEmails(newEmails);
    }

    const handleDefaultEmailChange = (index: number) => {
        const newEmails: CustomerEmailInfo[] = emails.map((email, i) => ({
            ...email,
            is_default: i === index,
        }));
        setValue('emails', newEmails);
        setEmails(newEmails);
    };

    const handleResendCode = () => {

    }

    const handleVerifyCode = (otp: string) => {

    }

    const selectedGender = useMemo(() => {
        const findGender = OptionGenders?.find(item => (item?.value === genderValue));
        if(!findGender) return null
        clearErrors('gender');
        return {...findGender, label: t(`${findGender?.label}`)}
    },[genderValue, data]);

    const isEditProfile = useMemo(() => {
        return searchParams.get(QueryParamsType.ProfileType) === ProfileRouteType.EditProfile;
    },[searchParams])

    const isPageProfile = useMemo(() => {
        return searchParams.has(QueryParamsType.ProfileType)
    },[searchParams])
    
    return ( 
        <article className={`profile__info ${!isPageProfile ? 'isPageProfile' : ''}`}>
            <div className="profile__info-title">
                <h2>{t('SCR_PERSONAL_INFORMATION')}</h2>
            </div>
            <div className="profile__info-content">
                <div className="profile__info-form">
                    <div className="profile__info-form-group">
                        <div className="profile__info-form-field">
                            <Input
                                label={`${t('SCR_FIRST_NAME')}`}
                                type="text"
                                placeholder={`*${t('SCR_FIRST_NAME')}`}
                                error={errors.first_name}
                                readOnly={!isEditProfile}
                                register={register('first_name')}
                                errorMessage={`${t(`${errors.first_name?.message}`, { name: t("SCR_FIRST_NAME"), max: 30 })}`}
                            />
                        </div>
                        <div className="profile__info-form-field">
                            <Input
                                label={`${t('SCR_LAST_NAME')}`}
                                type="text"
                                placeholder={`*${t('SCR_LAST_NAME')}`}
                                readOnly={!isEditProfile}
                                error={errors.last_name}
                                register={register('last_name')}
                                errorMessage={`${t(`${errors.last_name?.message}`, { name: t("SCR_FIRST_NAME"), max: 30 })}`}
                            />
                        </div>
                    </div>
                    <div className="profile__info-form-group">
                        <div className="profile__info-form-field">
                            <Input
                                label={`${t('SCR_GIFT_RECEIVER_PHONE')}`}
                                type="text"
                                placeholder={`*${t('SCR_GIFT_RECEIVER_PHONE')}`}
                                error={errors.phone}
                                register={register('phone')}
                                readOnly={true}
                                errorMessage={`${t(`${errors?.phone?.message}`, { name: t("SCR_GIFT_RECEIVER_PHONE") })}`}
                            />
                        </div>
                        <div className="profile__info-form-field">
                            <label className="profile__info-form-field-label">{t('SCR_BIRTHDAY')}</label>
                            <Controller
                                name="birthday"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        locale={i18n.language}
                                        selected={field.value}
                                        autoComplete='off'
                                        onChange={(date: Date | null) => field.onChange(date)}
                                        placeholderText={t("SCR_BIRTHDAY")}
                                        dateFormat="yyyy-MM-dd"
                                        readOnly={!isEditProfile}
                                        maxDate={moment().toDate()}
                                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                    />
                                )}
                            />
                             {errors?.birthday && <p className='profile__info-form-field-error'>{t(`${errors?.birthday?.message}`, { name: t("SCR_BIRTHDAY") })}</p>}
                        </div>
                    </div>
                    <div className="profile__info-form-group">
                        <div className="profile__info-form-field">
                            <label className="profile__info-form-field-label">{t('SCR_GENDER')}</label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        field={field}
                                        options={OptionGenders}
                                        placeholder={`${t('SCR_GENDER')}`}
                                        setValue={(value) => setValue('gender', value)}
                                        error={errors?.gender}
                                        errorMessage={`${t(`${errors?.gender?.message}`, { name: t("SCR_GENDER") })}`}
                                        value={selectedGender || null}
                                        isDisabled={!isEditProfile}
                                    />
                                )}
                            />
                        </div>
                        <div className="profile__info-form-field">
                            <div className="profile__info-form-field">
                                <label className="profile__info-form-field-label">{t('SCR_EMAIL_ADDRESS')}</label>
                                <div className='profile__info-form-field-multiple'>
                                    {
                                        emails?.map((email, index) => (
                                            <div className={`d-flex ${isEditProfile ? 'gap-0-5' :''}`} key={index}>
                                                {
                                                    isEditProfile &&
                                                    <Controller
                                                        name={`emails.${index}.is_default`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div>
                                                                <Radio
                                                                    checked={field.value}
                                                                    id={field.name}
                                                                    name={`emails[${index}].is_default`}
                                                                    value={String(field.value)}
                                                                    onChange={(e) => handleDefaultEmailChange(index)}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                }
                                                <div className='profile__info-form-field-multiple-controller'>
                                                    <Controller 
                                                        name={`emails.${index}.id`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div>
                                                                <input type='hidden' {...field} name={field.name}/>
                                                            </div>
                                                        )}
                                                    />
                                                    <Controller 
                                                        name={`emails.${index}.email`} 
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div>
                                                                <input autoComplete='off' readOnly={isEditProfile ? email?.type !== CustomerEmailTypeEnum.Others ? true : false : true} placeholder={`*${t('SCR_EMAIL_ADDRESS')}`} className={`profile__info-form-field-input ${errors?.emails?.[index]?.email?.message ? 'error-input' : ''}`} {...field} name={field.name} value={field.value}/>
                                                                {
                                                                    errors?.emails?.[index]?.email &&
                                                                    <p className='profile__info-form-field-error'>{t(`${errors?.emails?.[index]?.email?.message}`, { name: t("SCR_EMAIL_ADDRESS") })}</p>
                                                                }
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                                {
                                                    isEditProfile && (
                                                    index === 0 ? 
                                                    <button onClick={handleAddEmail} className='profile__info-form-field-multiple-btn'>&#65291;</button> :
                                                    email?.type === CustomerEmailTypeEnum.Others && !email?.is_default ? 
                                                    <button onClick={() => handleDeleteEmail(index)} className='profile__info-form-field-multiple-btn'>&minus;</button>:
                                                    <div style={{width: isEditProfile ? '30px' : '0px'}}></div>)
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        isEditProfile ?
                        <div className="profile__info-form-group">
                            <div className="profile__info-form-field">
                                <button onClick={handleSubmit(handleUpdateProfile)} className={`btn profile__info-form-btn-edit ${isLoadingUpdateProfile ? 'loading' : ''}`}>
                                    {t('SCR_SAVE')}
                                </button>
                            </div>
                            <div onClick={() => push(`${RouteType.Profile}?${QueryParamsType.ProfileType}=${ProfileRouteType.ViewProfile}`)} className="profile__info-form-field">
                                <button className='btn profile__info-form-btn-changePass'>
                                    {t('SCR_CANCEL')}
                                </button>
                            </div>  
                        </div>
                        :
                        <div className="profile__info-form-group">
                            <div className="profile__info-form-field">
                                <button onClick={() => push(`${RouteType.Profile}?${QueryParamsType.ProfileType}=${ProfileRouteType.EditProfile}`)} className='btn profile__info-form-btn-edit'>
                                    {t('SCR_EDIT_PERSONAL_INFORMATION')}
                                </button>
                            </div>
                            <div className="profile__info-form-field">
                                <button className='btn profile__info-form-btn-changePass'>
                                    {t('SCR_CHANGE_PASSWORD')}
                                </button>
                            </div>  
                        </div>
                    }
                </div>
            </div>

            <ModalVerifyOtp
                show={showModalOtp}
                phoneNumber={getValues('phone')}
                onClose={onToggleModalOtp}
                isLoading={false}
                onResendCode={handleResendCode}
                onVerifyCode={handleVerifyCode}
            />
        </article>
     );
}

export default ProfileInfomation;