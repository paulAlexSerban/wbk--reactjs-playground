import classes from './Input.module.scss';
import { type ComponentPropsWithoutRef, useRef, forwardRef, useImperativeHandle } from 'react';

export type InputProps = {
    label: string;
    isValid: boolean;
    isTouched: boolean | undefined;
} & ComponentPropsWithoutRef<'input'>;

export type InputHandle = {
    focus: () => void;
};
const InputWithRef = forwardRef<InputHandle, InputProps>(({ id, label, isValid, isTouched, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const activate = () => {
        inputRef.current?.focus();
    };

    useImperativeHandle(ref, () => {
        return {
            focus: activate,
        };
    });

    return (
        <div
            className={`${classes.control}
            ${isTouched && !isValid ? classes.invalid : ''}
        `}
        >
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} ref={inputRef} {...props} />
        </div>
    );
});

export default InputWithRef;
