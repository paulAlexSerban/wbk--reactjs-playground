import { FaBars } from 'react-icons/fa';
import { useGlobalContext } from '../../context/context';
import NavLinks from './NavLinks';

const Navbar = () => {
    const { openSidebar, setPageId } = useGlobalContext();

    const handleSubmenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        const isNavLink = target.classList.contains('nav-link');

        if (!isNavLink) {
            setPageId(null);
        }
    };

    return (
        <nav onMouseOver={handleSubmenu}>
            <div className="nav-center">
                <h3 className="logo">strapi</h3>
                <button className="toggle-btn" onClick={openSidebar}>
                    <FaBars />
                </button>
                <NavLinks />
            </div>
        </nav>
    );
};

export default Navbar;
