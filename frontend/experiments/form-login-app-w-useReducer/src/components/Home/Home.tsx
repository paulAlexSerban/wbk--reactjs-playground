import { type FC } from 'react';

import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import classes from './Home.module.scss';
import { useAuthContext } from '../../store/auth-context';
// type HomeProps = {
//     onLogout?: () => void;
// };

const Home: FC = () => {
    const { onLogout } = useAuthContext();
    return (
        <Card className={classes.home}>
            <h1>Welcome back!</h1>
            <Button onClick={onLogout}>Logout</Button>
        </Card>
    );
};

export default Home;
