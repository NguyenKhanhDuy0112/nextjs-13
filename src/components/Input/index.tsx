import { ForwardedRef, forwardRef } from 'react';
import { FieldErrors, DeepMap, FieldValues } from 'react-hook-form';

interface CustomInputProps<TFieldValues extends FieldValues> {
  label?: keyof TFieldValues;
  type: string;
  name?: string;
  placeholder: string;
  register: any;
  error?: DeepMap<TFieldValues, FieldErrors>;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: (value: string) => void;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, CustomInputProps<FieldValues>>(
  ({ label, type, placeholder, register, error, disabled, onBlur, errorMessage, readOnly, name }, ref: ForwardedRef<HTMLInputElement>) => {

    return (
      <div className="input-container">
        {label && <label className='input-label'>{label}</label>}
        <input
          ref={ref}
          name={name}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`${error ? 'input-error' : ''} input`}
          {...register}
          onBlur={(e) => onBlur && onBlur(e?.target?.value)}
          autoComplete='off'
        />
        {error && <p className="input-error-message">{errorMessage}</p>}
      </div>
    );
  }
);

export default Input;
