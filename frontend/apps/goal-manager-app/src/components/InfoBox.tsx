import { type FC, type PropsWithChildren } from 'react';

type HintBoxProps = PropsWithChildren<{
    mode: 'hint';
}>;

type WarningBoxProps = PropsWithChildren<{
    mode: 'warning';
    severity?: 'low' | 'medium' | 'high';
}>;

type InfoBoxProps = HintBoxProps | WarningBoxProps;

const InfoBox: FC<InfoBoxProps> = (props) => {
    const classes = ['infoBox'];

    if (props.mode === 'hint') {
        const { children } = props;
        classes.push('infoBox-hint');
        return (
            <aside className={classes.join(' ')}>
                <div>{children}</div>
            </aside>
        );
    }

    if (props.mode === 'warning') {
        const { children, severity } = props;
        classes.push('infoBox-warning');
        severity && classes.push(`warning--${severity}`);

        return (
            <aside className={classes.join(' ')}>
                <h2>Warning</h2>
                <div>{children}</div>
            </aside>
        );
    }
};

export default InfoBox;
