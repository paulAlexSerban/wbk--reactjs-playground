import { FC } from 'react';
import { UserList as TUserList } from '../types.d';

type UserListProps = TUserList;

const UserList: FC<UserListProps> = ({ users }) => {
    const renderedUsers = users.map((user) => {
        return (
            <tr key={user.name}>
                <td data-testid="name">{user.name}</td>
                <td data-testid="email">{user.email}</td>
            </tr>
        );
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody data-testid="users">{renderedUsers}</tbody>
        </table>
    );
};

export default UserList;
