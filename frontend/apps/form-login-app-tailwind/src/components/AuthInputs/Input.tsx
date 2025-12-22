import { type FC, type ChangeEvent } from 'react';

type InputProps = {
    label: string;
    type: string;
    invalid?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Input: FC<InputProps> = ({ label, invalid, ...props }) => {
    let labelClasses = 'block mb-2 text-xs font-bold tracking-wide uppercase';
    let inputClasses = 'w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow ';
    if (invalid) {
        labelClasses += ' text-red-500';
        inputClasses += ' border-red-500 bg-red-200';
    } else {
        labelClasses += ' text-stone-500';
        inputClasses += ' border-stone-500 bg-stone-300';
    }

    return (
        <div>
            <label className={labelClasses}>{label}</label>
            <input className={inputClasses} {...props} />
        </div>
    );
};

export default Input;
