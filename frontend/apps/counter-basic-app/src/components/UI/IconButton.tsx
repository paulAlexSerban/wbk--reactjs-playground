import { log } from '../../log.js';
import { type FC, type ReactNode, memo } from 'react';

// Update the IconButtonProps to accept a React component for the icon.
type IconButtonProps = {
    children: ReactNode;
    icon: FC<any>; // Accept any functional component
    onClick: () => void;
};

/**
 * using memo here is not enough as the onClick function is different for each
 * instance of the component
 *
 * the onClick needs to use useCallback to be memoized
 */

const IconButton: FC<IconButtonProps> = memo(({ children, icon: Icon, ...props }) => {
    log('<IconButton /> rendered', 2);

    // Directly use the Icon component passed via props
    return (
        <button {...props} className="button">
            <Icon className="button-icon" />
            <span className="button-text">{children}</span>
        </button>
    );
});

export default IconButton;
