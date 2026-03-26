import { type FC, type PropsWithChildren, type ComponentPropsWithoutRef } from 'react';

type ButtonProps = PropsWithChildren<{
    href?: never;
}> &
    ComponentPropsWithoutRef<'button'>;

type AnchorProps = PropsWithChildren<{
    href?: string;
}> &
    ComponentPropsWithoutRef<'a'>;

type Props = ButtonProps | AnchorProps;

// this is a type predicate
const isAnchorProps = (props: Props): props is AnchorProps => {
    return 'href' in props;
};

const Button: FC<Props> = (props) => {
    if (isAnchorProps(props)) {
        return (
            <a className="button" {...props}>
                {props.children}
            </a>
        );
    }

    return (
        <button className="button" {...props}>
            {props.children}
        </button>
    );
};

export default Button;
