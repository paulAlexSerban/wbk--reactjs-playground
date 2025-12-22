// Importing necessary libraries, hooks and styles
import { useSelector } from 'react-redux';
import '../styles/statusbar.css';

// Importing the RootState type for the Redux store.
import type { RootState } from '../redux/store';

/**
 * StatusBar is a functional component that displays the current status of the user.
 * It retrieves the status data from the Redux store and displays it.
 * @returns {JSX.Element} The JSX code for the StatusBar component.
 */
const StatusBar = (): JSX.Element => {
    // Using the useSelector hook from 'react-redux' to select the 'status' state from the Redux store.
    const status = useSelector((state: RootState) => state.status);

    // The StatusBar component renders a status bar with details about the user's net coins, experience, and completed lessons.
    return (
        <div className="status_bar__container">
            <h3>Status</h3>
            <ul>
                <li>
                    Net Coins: <span>{status.netCoins}</span>
                </li>
                <li>
                    Experience: <span>{status.experience} xp</span>
                </li>
                <li>
                    Completed lessons: <span>{status.completedLessons}</span>
                </li>
            </ul>
        </div>
    );
};

// Exporting the StatusBar component as the default export.
export default StatusBar;
