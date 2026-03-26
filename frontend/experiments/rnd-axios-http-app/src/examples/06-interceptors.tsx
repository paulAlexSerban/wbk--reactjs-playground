import { useEffect } from 'react';
import authFetch from '../axios/interceptors';
const URL = 'https://www.course-api.com/react-store-products';

/**
 * Interceptors are functions that are called for every request and response before they are handled by then or catch.
 */

const Interceptors = () => {
    const fetchData = async () => {
        try {
            const response = await authFetch.get(URL);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <h2 className="text-center">interceptors</h2>;
};
export default Interceptors;
