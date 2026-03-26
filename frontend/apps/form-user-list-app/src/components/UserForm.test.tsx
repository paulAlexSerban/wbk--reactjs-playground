import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import UserForm from './UserForm';

describe('UserForm', () => {
    const mockOnUserAdd = jest.fn();
    const SUT = <UserForm onUserAdd={mockOnUserAdd} />;

    test('it shows two input fields and a submit button', () => {
        render(SUT);

        const inputs = screen.getAllByRole('textbox');
        const button = screen.getByRole('button');

        const expectedInputCount = 2;
        expect(inputs).toHaveLength(expectedInputCount);
        expect(button).toBeInTheDocument();
    });

    test('it calls onUserAdd with the correct user', async () => {
        render(SUT);

        const nameText = 'John Doe';
        const emailText = 'john@doe.com';

        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const emailInput = screen.getByRole('textbox', { name: /email/i });

        const button = screen.getByRole('button');

        // Simulate the user typing in the input fields
        await user.type(nameInput, nameText);
        await user.type(emailInput, emailText);

        // Simulate the user clicking the submit button
        await user.click(button);

        const expected = { name: nameText, email: emailText };
        expect(mockOnUserAdd).toHaveBeenCalledWith(expected);
    });

    test('it clears the input fields after submitting', async () => {
        render(SUT);

        const nameText = 'John Doe';
        const emailText = 'john@doe.com';

        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const emailInput = screen.getByRole('textbox', { name: /email/i });

        const button = screen.getByRole('button');

        // Simulate the user typing in the input fields
        await user.type(nameInput, nameText);
        await user.type(emailInput, emailText);

        // Simulate the user clicking the submit button
        await user.click(button);

        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');

        const expected = { name: nameText, email: emailText };
        expect(mockOnUserAdd).toHaveBeenCalledWith(expected);
    });
});
