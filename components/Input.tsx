interface InputProps {
    placeholder?: string;
    value?: string;
    type?: string;
    disabled?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string
}

const Input = ({
    placeholder,
    value,
    type,
    disabled,
    onChange,
    label
}: InputProps) => {
    return (
        <div className="w-full">
            {label && <p className="text-xl text-white font-semibold mb-2">{label}</p>}
            <input
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                type={type}
                onChange={onChange}
                className="
                    w-full
                    p-4
                    text-lg
                    bg-black
                    border-2
                    border-neutral-800
                    rounded-md
                    outline-none
                    text-white
                    focus:border-sky-500
                    focus:border-2
                    transition
                    disabled:bg-neutral-900
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                "
            />
        </div>
    )
}

export default Input;