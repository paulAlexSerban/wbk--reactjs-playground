import { FC } from 'react';
import { Person as PersonType } from '../types';
import Person from './Person';

type ListProps = {
    people: PersonType[];
};

const List: FC<ListProps> = ({ people }) => {
    return (
        <ul>
            {people.map((person) => {
                const { id } = person;
                return <Person key={id} {...person} />;
            })}
        </ul>
    );
};

export default List;
