interface ProgressBarProps {
    progress: Number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
    const progressBarContainer = {
        height: 20,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: 50,
    };

    const progressFiller = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: 'purple',
        borderRadius: 'inherit',
        transition: 'width 0.4s ease-in-out',
    };

    return (
        <div style={progressBarContainer}>
            <div style={progressFiller}></div>
        </div>
    );
};

export default ProgressBar;
