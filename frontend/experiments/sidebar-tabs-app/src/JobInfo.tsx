import { FC } from 'react';

import Duties from './Duties';

export type Job = {
    id: number;
    company: string;
    dates: string;
    duties: string[];
    title: string;
};

type JobInfoProps = {
    jobs: Job[];
    currentItem: number;
};

const JobInfo: FC<JobInfoProps> = ({ jobs, currentItem }) => {
    // alternatives
    const { company, dates, duties, title } = jobs[currentItem];

    return (
        <article className="job-info">
            <h3>{title}</h3>
            <span className="job-company">{company}</span>
            <p className="job-date">{dates}</p>
            <Duties duties={duties} />
        </article>
    );
};
export default JobInfo;
