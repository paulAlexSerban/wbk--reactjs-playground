import styled from 'styled-components';
import { FC } from 'react';
const StyledButton = styled.button`
    padding: 1rem 2rem;
    font-weight: 600;
    text-transform: uppercase;
    border-radius: 0.25rem;
    color: #1f2937;
    background-color: #f0b322;
    border-radius: 6px;
    border: none;

    &:hover {
        background-color: #f0920e;
    }
`;

type ButtonProps = {
    onClick: () => void;
};

const Button: FC<ButtonProps> = ({ onClick }) => {
    return (
        <StyledButton type="button" onClick={onClick}>
            Sign In
        </StyledButton>
    );
};

export default Button;
