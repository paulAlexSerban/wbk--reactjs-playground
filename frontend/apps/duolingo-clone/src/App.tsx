import './styles/app.css';
import SideBarNav from './components/SideBarNav';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <SideBarNav />
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default App;
