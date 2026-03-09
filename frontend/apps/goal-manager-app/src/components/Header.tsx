import { type FC, type PropsWithChildren } from 'react';

type Image = {
    src: string;
    alt: string;
};

type HeaderProps = PropsWithChildren<{
    image: Image;
}>;

const Header: FC<HeaderProps> = ({ image, children }) => {
    return (
        <header>
            {children}
            <img src={image.src} alt={image.alt} />
        </header>
    );
};

export default Header;
