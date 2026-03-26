import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { usePourTracker } from '../hooks/usePourTracker';
import './PourTrainer.css';

export default function PourTrainer() {
    const { beta, isPermissionGranted, requestPermission, error } = useDeviceOrientation();

    const { pouring, currentTime, currentVolume, target, delta, history, setTarget } = usePourTracker(beta);

    const handleEnableMotion = () => {
        requestPermission();
    };

    const getStatusMessage = () => {
        if (error) return error;
        if (isPermissionGranted === null) return 'Sensor inactive.';
        if (pouring) return 'Pouring in progress... keep tilted, then bring the phone back upright.';
        if (isPermissionGranted) return 'Sensor active. Hold the phone like a bottle and tilt to "pour".';
        return 'Sensor inactive.';
    };

    return (
        <div className="app">
            <h1>AbcBar Tilt Pour Trainer</h1>

            <div className="card">
                <p>
                    <strong>1.</strong> Press the button below to activate the motion sensor.
                </p>
                <p>
                    <strong>2.</strong> Hold the phone like a bottle (vertical).
                </p>
                <p>
                    <strong>3.</strong> Tilt the phone as if pouring, then bring it back upright.
                </p>
                {!isPermissionGranted && <button onClick={handleEnableMotion}>Start Sensor</button>}
                <p className="status">{getStatusMessage()}</p>
            </div>

            <div className="card">
                <div className="row">
                    <span>Pour time:</span>
                    <span className="highlight">
                        <span id="time">{currentTime.toFixed(2)}</span> s
                    </span>
                </div>
                <div className="row">
                    <span>Estimated volume:</span>
                    <span className="highlight">
                        <span id="volume">{currentVolume.toFixed(1)}</span> ml
                    </span>
                </div>
                <div className="row">
                    <span>Target:</span>
                    <span>
                        <select id="target" value={target} onChange={(e) => setTarget(Number(e.target.value))}>
                            <option value="20">20 ml</option>
                            <option value="25">25 ml</option>
                            <option value="30">30 ml</option>
                            <option value="40">40 ml</option>
                            <option value="45">45 ml</option>
                            <option value="50">50 ml</option>
                            <option value="60">60 ml</option>
                        </select>
                    </span>
                </div>
                <div className="row">
                    <span>Difference from target:</span>
                    <span className="highlight">
                        <span id="delta">
                            {delta >= 0 ? '+' : ''}
                            {delta.toFixed(1)}
                        </span>{' '}
                        ml
                    </span>
                </div>
                <p className="hint">
                    Volume estimation is based on an average free-pour rate (approx. 30 ml / second).
                </p>
            </div>

            <div className="card">
                <h2>Pour History</h2>
                <ul id="history">
                    {history.map((event, index) => (
                        <li key={event.timestamp + index}>
                            {event.volume.toFixed(1)} ml in {event.duration.toFixed(2)} s (target {event.target} ml,
                            difference {event.delta >= 0 ? '+' : ''}
                            {event.delta.toFixed(1)} ml)
                        </li>
                    ))}
                </ul>
                <p className="hint">The last 10 pours are kept. Use it as a precision "game" for practice at home.</p>
            </div>

            <p className="hint">
                Note: Behavior may vary slightly depending on your phone and browser. For iPhone, grant permission for
                motion/orientation when prompted.
            </p>
        </div>
    );
}
