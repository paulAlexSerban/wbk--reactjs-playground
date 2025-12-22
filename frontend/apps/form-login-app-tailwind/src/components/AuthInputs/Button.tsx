import { type FC, type ReactNode } from 'react';

type ButtonProps = {
    type: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: () => void;
    children: ReactNode;
};

const Button: FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button
            className="px-4 py-2 font-semibold uppercase rounded text-stone-900 bg-amber-400 hover:bg-amber-500"
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
