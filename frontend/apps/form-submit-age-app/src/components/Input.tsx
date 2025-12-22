import { type ComponentPropsWithoutRef, forwardRef } from 'react';

export type InputProps = {
    label: string;
} & ComponentPropsWithoutRef<'input'>;

// forwardRef is a generic function that takes two type arguments
const InputWithRef = forwardRef<HTMLInputElement, InputProps>(({ id, label, ...props }, ref) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} ref={ref} {...props} />
        </div>
    );
});

export default InputWithRef;
