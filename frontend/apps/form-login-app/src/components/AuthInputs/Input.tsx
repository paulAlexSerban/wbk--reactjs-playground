import styled from 'styled-components';
import { type FC, type ChangeEvent } from 'react';

type LabelProps = {
    $invalid?: boolean;
};

const Label = styled.label<LabelProps>`
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ $invalid }) => ($invalid ? '#EF4444' : '#6b7280')};
`;

type InputProps = {
    $invalid?: boolean;
};
const Input = styled.input<InputProps>`
    width: 100%;
    padding: 0.75rem 1rem;
    line-height: 1.5;
    background-color: ${({ $invalid }) => ($invalid ? '#FEE2E2' : '#d1d5db')};
    color: ${({ $invalid }) => ($invalid ? '#EF4444' : '#374151')};
    border: 1px solid transparent;
    border-radius: 0.25rem;
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

type CustomInputProps = {
    label: string;
    type: string;
    invalid?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput: FC<CustomInputProps> = ({ label, invalid, ...props }) => {
    return (
        <div>
            <Label $invalid={invalid}>{label}</Label>
            <Input $invalid={invalid} {...props} />
        </div>
    );
};

export default CustomInput;
