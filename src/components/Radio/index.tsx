import { ChangeEvent } from "react";

interface RadioProps{
    name?: string;
    id?: string;
    children?: React.ReactNode;
    checked?: boolean;
    value?: any,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Radio(props: RadioProps) {
    const { children, id, name, onChange, checked, value } = props;

    return ( 
        <div className="radio-wrapper">
            <input onChange={(e) => onChange && onChange(e)} checked={checked} value={value} className="radio-input" name={name} id={id} type="radio"/>
            <label className="radio-label" htmlFor={id}>
                <span className="radio-inner-circle"></span>
                {children}
            </label>
        </div>
     );
}

export default Radio;