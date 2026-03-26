import { useEffect } from 'react';
import axios from 'axios';

const PRODUCTS_URL = 'https://www.course-api.com/react-store-products';
const RANDOM_USER_URL = 'https://randomuser.me/api';

/**
 * Downside with this approach is that we send teh same headers to all requests
 * and in case of sensitive data, it can be a security issue.
 */

const GlobalInstance = () => {
    const fetchData = async () => {
        try {
            const products = await axios.get(PRODUCTS_URL);
            console.log(products);

            const randomUser = await axios.get(RANDOM_USER_URL);
            console.log(randomUser);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <h2 className="text-center">global instance</h2>;
};
export default GlobalInstance;
