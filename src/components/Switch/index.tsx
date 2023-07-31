
interface SwitchProps{
    onChange: (checked: boolean) => void;
}

function Switch(props: SwitchProps) {
    const { onChange } = props;
    return ( 
        <article className="Switch">
            <label className="switch">
                <input onChange={(e) => onChange(e.target.checked)} type="checkbox"/>
                <span className="slider"></span>
            </label>
        </article>
     );
}

export default Switch;