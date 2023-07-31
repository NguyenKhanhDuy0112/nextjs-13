import PinInput from "react-pin-input";

interface OtpInputProps{
    length?: number;
    onChange?: () => void;
    onComplete: (value: string) => void;
}

function OtpInput(props: OtpInputProps) {
    const { length = 6, onChange, onComplete } = props;

    return ( 
        <article className="otp-input">
            <PinInput
                length={6}
                initialValue=""
                type="numeric"
                onChange={onChange!}
                inputMode="number"
                placeholder={""}
                style={{ padding: "10px 0" }}
                onComplete={(value: string, index: number) => {
                    onComplete(value);
                }}
                autoSelect={true}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
            />
        </article>
     );
}

export default OtpInput;