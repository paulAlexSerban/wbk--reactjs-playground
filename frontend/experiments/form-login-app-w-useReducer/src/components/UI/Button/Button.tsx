import { type FC, type ReactNode } from 'react';

import classes from './Button.module.scss';

type ButtonProps = {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    children: ReactNode;
};

const Button: FC<ButtonProps> = (props) => {
    return (
        <button
            type={props.type || 'button'}
            className={`${classes.button} ${props.className}`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;
