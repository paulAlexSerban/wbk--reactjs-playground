// Importing the RootState type from the Redux store configuration.
// This represents the state type of the entire Redux store.
import type { RootState } from '../redux/store';

// Importing the Unit component that will be used to display each unit of learning.
import Unit from '../components/Unit/Unit';

// Importing the useSelector hook from 'react-redux'.
// This hook allows you to extract data from the Redux store state, using a selector function.
import { useSelector } from 'react-redux';

// Define a type for unit for better type safety
type UnitType = {
    id: number;
    title: string;
    description: string;
    enabled: boolean;
    finished: boolean;
    lessons: {
        id: Number;
        title: string;
        description: string;
        avatar: string;
        enabled: boolean;
        finished: boolean;
    }[];
};

/**
 * Learn is a functional component that renders the learning units.
 * @returns {JSX.Element} A container with a list of Unit components.
 */
const Learn = () => {
    // Using useSelector to access the 'units' state in the Redux store.
    const units = useSelector((state: RootState) => state.units);

    // Rendering a list of Unit components.
    return (
        <div id="learn__container">
            {units.map((unit: UnitType) => (
                <Unit key={unit.id} unit={unit} />
            ))}
        </div>
    );
};

// Exporting the Learn component as the default export.
export default Learn;
