import { forwardRef } from 'react';

type InputProps = {
    label: string;
    type: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => {
    // Todo: Accept forwarded ref and "connect" it to the <input> element
    return (
        <p className="control">
            <label>{label}</label>
            <input {...props} ref={ref} />
        </p>
    );
});

export default Input;
