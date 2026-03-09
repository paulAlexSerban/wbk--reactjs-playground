import { type FC } from 'react';
import logoImg from '../assets/quiz-logo.png';

const Header: FC = () => {
    return (
        <header>
            <img src={logoImg} alt="Quiz app logo." />
            <h1>Quiz App</h1>
        </header>
    );
};

export default Header;
