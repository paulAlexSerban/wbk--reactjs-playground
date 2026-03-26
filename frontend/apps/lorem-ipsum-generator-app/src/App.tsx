import { useState } from 'react';
import data from './data';
import { nanoid } from 'nanoid';

type Data = string[];

const App = () => {
    const [count, setCount] = useState<number>(1);
    const [text, setText] = useState<Data>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let amount = count;
        const slicedData = data.slice(0, amount);
        setText(slicedData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCount(Number(e.target.value));
    };
    return (
        <section className="section-center">
            <h4>tired of boring lorem ipsum?</h4>
            <form className="lorem-form" onSubmit={handleSubmit}>
                <label htmlFor="amount">paragraphs:</label>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    min="1"
                    step="1"
                    max="8"
                    value={count}
                    onChange={handleChange}
                />
                <button className="btn" type="submit">
                    generate
                </button>
            </form>
            <article className="lorem-text">
                {text.map((item) => {
                    return <p key={nanoid()}>{item}</p>;
                })}
            </article>
        </section>
    );
};
export default App;
