import { type FC, type ReactNode } from 'react';

import classes from './Card.module.scss';

type CardProps = {
    className?: string;
    children: ReactNode;
};

const Card: FC<CardProps> = (props) => {
    return <div className={`${classes.card} ${props.className}`}>{props.children}</div>;
};

export default Card;
