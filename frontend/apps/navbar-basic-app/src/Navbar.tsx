import { useState, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { links, social } from './data';
import logo from './assets/logo.svg';

const Navbar = () => {
    const [showLinks, setShowLinks] = useState(false);
    const linksContainerRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLUListElement>(null);

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    const linkStyles = {
        height: showLinks ? `${linksRef.current ? linksRef.current.getBoundingClientRect().height : 0}px` : '0px',
    };

    return (
        <nav>
            <div className="nav-center">
                <div className="nav-header">
                    <img src={logo} className="logo" alt="logo" />
                    <button className="nav-toggle" onClick={toggleLinks}>
                        <FaBars />
                    </button>
                </div>

                <div className="links-container" ref={linksContainerRef} style={linkStyles}>
                    <ul className="links" ref={linksRef}>
                        {links.map((link) => {
                            const { id, url, text } = link;
                            return (
                                <li key={id}>
                                    <a href={url}>{text}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {/* social links */}
                <ul className="social-icons">
                    {social.map((socialIcon) => {
                        const { id, url, icon } = socialIcon;
                        return (
                            <li key={id}>
                                <a href={url}>{icon}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};
export default Navbar;
