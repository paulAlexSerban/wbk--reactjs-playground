import { FC } from 'react';
import { Link } from 'react-router-dom';

const PRODUCTS = [
    {
        id: 1,
        name: 'Product 1',
    },
    {
        id: 2,
        name: 'Product 2',
    },
    {
        id: 3,
        name: 'Product 3',
    },
];

const ProductsPage: FC = () => {
    return (
        <div>
            <h1>Products</h1>
            <ul>
                {PRODUCTS.map((product) => (
                    <li key={product.id}>
                        <Link to={product.id.toString()}>{product.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductsPage;
