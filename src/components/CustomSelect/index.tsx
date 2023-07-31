import { SelectOption } from '@/models';
import { forwardRef } from 'react';
import { FieldErrors, DeepMap, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from "react-select";

interface CustomSelectProps<TFieldValues extends FieldValues> {
  value?: any;
  placeholder: string;
  field: any;
  options: SelectOption[];
  setValue: (value: any) => void;
  error?: DeepMap<TFieldValues, FieldErrors>;
  isDisabled?: boolean;
  errorMessage?: string;
}

const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps<FieldValues>>(
  ({ placeholder, field, error, options, value, setValue, isDisabled, errorMessage }) => {
    const { t } = useTranslation();

    const customStyles = {
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isDisabled ? '#fff' : '#fff',
        borderColor: state.isFocused && !error ? '#242e52' : provided.borderColor, // Change the border color when focused
        boxShadow: state.isFocused && !error ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : provided.boxShadow, // Add box shadow when focused
        '&:hover': {
          borderColor: state.isFocused && !error ? '#242e52' : provided.borderColor,
        },
      }),
    };

    return (
      <div className="select-custom-container">
        <Select
            {...field}
            options={options?.map(item => ({...item, label: t(item?.label)}))}
            placeholder={placeholder}
            className={`select-custom ${error ? 'error' : ''}`}
            value={value}
            onChange={(value: any) => setValue(value?.value)}
            styles={customStyles}
            isDisabled={isDisabled}
          />
       
        {error && <p className="input-error-message">{t(errorMessage!)}</p>}
      </div>
    );
  }
);

export default CustomSelect;
