import { useEffect } from 'react';
import authFetch from '../axios/custom';

import axios from 'axios';
const RANDOM_USER_URL = 'https://randomuser.me/api';

/**
 * To be used when we want to send different headers to different requests.
 */

const CustomInstance = () => {
    const fetchData = async () => {
        try {
            const randomUser = await axios.get(RANDOM_USER_URL);
            console.log(randomUser);

            const response = await authFetch.get('/react-store-products');
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <h2 className="text-center">custom instance</h2>;
};
export default CustomInstance;
