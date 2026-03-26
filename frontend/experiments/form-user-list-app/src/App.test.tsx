import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from './App';
import { users as usersData } from './mock/users';
import { Users } from './types.d';

describe('App', () => {
    const SUT = <App />;
    test('it can receive a new user and show it on a list', async () => {
        render(SUT);

        const nameText = 'John Doe';
        const emailText = 'john@doe.com';

        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const button = screen.getByRole('button');

        await user.click(nameInput);
        await user.keyboard(nameText);

        await user.click(emailInput);
        await user.keyboard(emailText);

        // Simulate the user clicking the submit button
        await user.click(button);

        const nameCell = screen.getByTestId('name');
        const emailCell = screen.getByTestId('email');

        expect(nameCell).toHaveTextContent(nameText);
        expect(emailCell).toHaveTextContent(emailText);
    });

    test('it can receive multiple new users and show them on a list', async () => {
        render(SUT);
        const users: Users = usersData;

        for (let userData of users) {
            const nameInput = screen.getByRole('textbox', { name: /name/i });
            const emailInput = screen.getByRole('textbox', { name: /email/i });

            const button = screen.getByRole('button');

            // Simulate the user typing in the input fields
            await user.type(nameInput, userData.name);
            await user.type(emailInput, userData.email);

            // Simulate the user clicking the submit button
            await user.click(button);
        }
    });
});
