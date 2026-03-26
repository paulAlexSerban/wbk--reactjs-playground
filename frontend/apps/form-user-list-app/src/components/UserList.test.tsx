import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';
import { users as usersData } from '../mock/users';
import { Users } from '../types.d';

const renderComponent = () => {
    const users: Users = usersData;

    render(<UserList users={users} />);
    return {
        users,
    };
};

describe('UserList', () => {
    test('it renders one row for each user', () => {
        const { users } = renderComponent();

        const rows = within(screen.getByTestId('users')).getAllByRole('row');
        const expectedRowCount = users.length;

        expect(rows).toHaveLength(expectedRowCount);
    });

    test('it renders the correct headers', () => {
        renderComponent();

        const nameHeader = screen.getByRole('columnheader', { name: /name/i });
        const emailHeader = screen.getByRole('columnheader', { name: /email/i });

        expect(nameHeader).toBeInTheDocument();
        expect(emailHeader).toBeInTheDocument();
    });

    test('it shows a list of users', () => {
        const { users } = renderComponent();

        const nameCells = screen.getAllByTestId('name');
        const emailCells = screen.getAllByTestId('email');

        expect(nameCells).toHaveLength(users.length);
        expect(emailCells).toHaveLength(users.length);

        users.forEach((user: { name: string; email: string }, index: number) => {
            expect(nameCells[index]).toHaveTextContent(user.name);
            expect(emailCells[index]).toHaveTextContent(user.email);
        });
    });

    test('it renders email and name of each user', () => {
        const { users } = renderComponent();

        for (let user of users) {
            const name = screen.getByRole('cell', { name: user.name });
            const email = screen.getByRole('cell', { name: user.email });

            expect(name).toBeInTheDocument();
            expect(email).toBeInTheDocument();
        }
    });
});
