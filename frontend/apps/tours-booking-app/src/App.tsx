import { useState, useEffect } from 'react';
import Loading from './components/Loading';
import Tours from './components/Tours';
import { TourProps } from './types';

const URL = 'https://www.course-api.com/react-tours-project';

function App() {
    const [loading, setLoading] = useState(true);
    const [tours, setTours] = useState<TourProps[]>([]);

    const removeTour = (id: number) => {
        const newTours = tours.filter((tour) => tour.id !== id);
        setTours(newTours);
    };

    const fetchTours = async () => {
        setLoading(true);
        try {
            const response = await fetch(URL);
            const tours = await response.json();
            setLoading(false);
            setTours(tours);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleRefresh = () => {
        fetchTours();
    };
    useEffect(() => {
        fetchTours();
    }, []);
    if (loading) {
        return (
            <main>
                <Loading />
            </main>
        );
    }
    if (tours.length === 0) {
        return (
            <main>
                <div className="title">
                    <h2>no tours left</h2>

                    <button className="btn" onClick={handleRefresh}>
                        refresh
                    </button>
                </div>
            </main>
        );
    }
    return (
        <main>
            <Tours tours={tours} removeTour={removeTour} />
        </main>
    );
}

export default App;
