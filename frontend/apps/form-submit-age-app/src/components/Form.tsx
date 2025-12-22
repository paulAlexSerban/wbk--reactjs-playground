import { type FormEvent, type ComponentPropsWithoutRef, useRef, useImperativeHandle, forwardRef } from 'react';

export type FormHandle = {
    clear: () => void;
};

type FormProps = ComponentPropsWithoutRef<'form'> & {
    onSave: (value: unknown) => void;
};

const Form = forwardRef<FormHandle, FormProps>(function Form({ onSave, children, ...otherProps }, ref) {
    const formRef = useRef<HTMLFormElement>(null);

    // required to expose the clear method to the parent component
    // should be used in component with forwardRef
    // this is how you expose an imperative API to the parent component
    // imperative API is a way to interact with a component instance imperatively
    useImperativeHandle(ref, () => {
        return {
            clear() {
                console.log('CLEARING');
                formRef.current?.reset();
            },
        };
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit} {...otherProps} ref={formRef}>
            {children}
        </form>
    );
});

export default Form;
