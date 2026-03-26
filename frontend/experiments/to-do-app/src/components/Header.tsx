import { FC } from 'react';
import Button from './Button';

type HeaderProps = {
    formToggle: () => void;
    currentState: boolean;
};

const Header: FC<HeaderProps> = ({ formToggle, currentState }) => {
    return (
        <header className="header">
            <h1>ToDo List</h1>
            <Button formToggle={formToggle} currentState={currentState} />
        </header>
    );
};

export default Header;
