import { useState, FC } from 'react';
import { TourProps } from '../types';

const EXCERPT_SIZE: number = 200;

const Tour: FC<TourProps> = ({ id, image, info, name, price, removeTour }) => {
    const [readMore, setReadMore] = useState(false);
    const excerpt = info.substring(0, EXCERPT_SIZE);

    const handleReadMore = () => {
        setReadMore(!readMore);
    };

    const handleRemoveTour = () => {
        removeTour(id);
    };

    return (
        <article className="single-tour">
            <img src={image} alt={name} className="img" />
            <span className="tour-price">${price}</span>
            <div className="info">
                <h5>{name}</h5>
                <p>
                    {readMore ? info : `${excerpt}...`}
                    <button className="info-btn" onClick={handleReadMore}>
                        {readMore ? 'show less' : '  read more'}
                    </button>
                </p>
                <button className="delete-btn btn-block btn" onClick={handleRemoveTour}>
                    not interested
                </button>
            </div>
        </article>
    );
};

export default Tour;
