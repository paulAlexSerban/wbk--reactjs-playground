import { Person as PersonType } from '../types';
import { FC } from 'react';

const Person: FC<PersonType> = ({ id, name, age, image }) => {
    return (
        <li key={id} className="person">
            <img src={image} alt={name} className="img" />
            <div>
                <h4>{name}</h4>
                <p>{age} years</p>
            </div>
        </li>
    );
};

export default Person;
