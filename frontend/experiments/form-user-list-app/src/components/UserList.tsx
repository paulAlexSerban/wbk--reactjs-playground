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
        <table className="user-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody data-testid="users">
                {users.length > 0 ? (
                    renderedUsers
                ) : (
                    <tr>
                        <td className="empty-state" colSpan={2}>
                            No users added yet.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default UserList;
