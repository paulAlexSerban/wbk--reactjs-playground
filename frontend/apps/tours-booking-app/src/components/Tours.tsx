import { FC } from 'react';
import { ToursProps } from '../types';
import Tour from './Tour';

const Tours: FC<ToursProps> = ({ tours, removeTour }) => {
    return (
        <section>
            <div className="title">
                <h2>our tours</h2>
                <div className="title-underline"></div>
            </div>
            <div className="tours">
                {tours.map((tour) => {
                    return <Tour key={tour.id} {...tour} removeTour={removeTour} />;
                })}
            </div>
        </section>
    );
};

export default Tours;
