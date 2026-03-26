import { useState } from 'react';
import axios from 'axios';
const URL = 'https://www.course-api.com/axios-tutorial-post';

const PostRequest = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const postData = async () => {
        try {
            const response = await axios.post(URL, {
                name,
                email,
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name && email) {
            postData();
            setName('');
            setEmail('');
        } else {
            console.log('empty values');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else {
            setEmail(value);
        }
    };

    return (
        <section>
            <h2 className="text-center">post request</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="name" className="form-label">
                        name
                    </label>
                    <input type="text" className="form-input" id="name" value={name} onChange={handleInputChange} />
                </div>
                <div className="form-row">
                    <label htmlFor="email" className="form-label">
                        email
                    </label>
                    <input type="email" className="form-input" id="email" value={email} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-block">
                    login
                </button>
            </form>
        </section>
    );
};
export default PostRequest;
