import { FC } from 'react';
type ButtonProps = {
    formToggle: () => void;
    currentState: boolean;
};

const Button: FC<ButtonProps> = ({ formToggle, currentState }) => {
    return (
        <button className="add-btn" onClick={formToggle} style={{ backgroundColor: currentState ? 'red' : 'green' }}>
            {currentState ? 'Close' : 'Add'}
        </button>
    );
};

export default Button;
