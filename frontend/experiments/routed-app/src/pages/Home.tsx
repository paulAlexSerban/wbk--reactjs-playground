import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage: FC = () => {
    const navigate = useNavigate();

    const navigateHandler = () => {
        navigate('products');
    };

    return (
        <div>
            <h1>Home</h1>
            <p>
                Go to <Link to="products">the list of products</Link>
            </p>
            <p>
                <button onClick={navigateHandler}>Go to the list of products</button>
            </p>
        </div>
    );
};

export default HomePage;
