import { FC } from 'react';
import { Job } from './JobInfo';

type BtnContainerProps = {
    jobs: Job[];
    currentItem: number;
    setCurrentItem: (item: number) => void;
};

const BtnContainer: FC<BtnContainerProps> = ({ jobs, currentItem, setCurrentItem }) => {
    return (
        <div className="btn-container">
            {jobs.map((item, index) => {
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentItem(index)}
                        className={index === currentItem ? 'job-btn active-btn' : 'job-btn'}
                    >
                        {item.company}
                    </button>
                );
            })}
        </div>
    );
};
export default BtnContainer;
