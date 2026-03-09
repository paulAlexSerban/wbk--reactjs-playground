import { type FC, type ReactNode, type ComponentPropsWithoutRef } from 'react';

type BaseProps = {
    children: ReactNode;
};

type ButtonProps = BaseProps & ComponentPropsWithoutRef<'button'>;

const Button: FC<ButtonProps> = ({ children, ...props }) => {
    const classes =
        'px-4 py-2 text-xs md:text-base rounded-md bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-100';
    return (
        <div className="mt-8">
            <button className={classes} {...props}>
                {children}
            </button>
        </div>
    );
};

export default Button;
