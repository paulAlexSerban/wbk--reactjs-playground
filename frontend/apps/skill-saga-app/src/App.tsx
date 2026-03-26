import { competency_types_map } from './data/competency_types';

const App = () => {
    return (
        <main>
            <h2>Skill Saga App.</h2>
            <ul>
                {Object.values(competency_types_map).map((competency_type) => (
                    <li key={competency_type.id}>
                        <h3>{competency_type.name}</h3>
                        <p>{competency_type.slug}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default App;
