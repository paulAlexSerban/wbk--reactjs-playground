import { v4 as uuidv4 } from 'uuid';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { FC } from 'react';

type DutiesProps = {
    duties: string[];
};

const Duties: FC<DutiesProps> = ({ duties }) => {
    return (
        <div>
            {duties.map((duty) => {
                const id = uuidv4();
                return (
                    <div key={id} className="job-desc">
                        <FaAngleDoubleRight className="job-icon"></FaAngleDoubleRight>
                        <p>{duty}</p>
                    </div>
                );
            })}
        </div>
    );
};
export default Duties;
