import { useGlobalContext } from '../../context/context';
import sublinks from '../../data/data';

const NavLinks = () => {
    const { setPageId } = useGlobalContext();

    const handleOnMouseEnter = (pageId: string) => {
        setPageId(pageId);
    };

    return (
        <div className="nav-links">
            {sublinks.map((item) => {
                const { pageId, page } = item;
                return (
                    <button key={pageId} className="nav-link" onMouseEnter={() => handleOnMouseEnter(pageId)}>
                        {page}
                    </button>
                );
            })}
        </div>
    );
};

export default NavLinks;
