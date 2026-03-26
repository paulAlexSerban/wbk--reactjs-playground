import { useParams, Link } from 'react-router-dom';

type RouteParams = {
    productId: string;
};

const ProductPage = () => {
    const { productId } = useParams<RouteParams>();

    return (
        <div>
            <h1>Product Details</h1>
            <p>Product ID: {productId}</p>
            <p>
                {/* - default is route and go back would get the user to root page
                    - adding relative="path" ges back only one level  */}
                <Link to=".." relative="path">
                    Go back!
                </Link>
            </p>
        </div>
    );
};

export default ProductPage;
