import { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { User } from './types.d';

function App() {
    const [users, setUsers] = useState<User[]>([]);

    const onUserAdd = (user: User) => {
        setUsers([...users, user]);
    };

    return (
        <div className="app-shell">
            <div className="card">
                <h1 className="app-title">User List</h1>
                <UserForm onUserAdd={onUserAdd} />
                <hr className="divider" />
                <UserList users={users} />
            </div>
        </div>
    );
}

export default App;
