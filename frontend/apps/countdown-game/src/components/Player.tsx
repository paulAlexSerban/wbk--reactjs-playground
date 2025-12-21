import { type FC, useState, useRef } from 'react';
import styles from './Player.module.scss';

const { base, heading, container, input, button } = styles;

const Player: FC = () => {
    const [name, setName] = useState<string | undefined>();

    const playerName = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (playerName.current) {
            setName(playerName.current.value);
            playerName.current.value = '';
        }
    };

    return (
        <section id="player" className={base}>
            <h2 className={heading}>Welcome {name ?? 'unknown entity'}</h2>
            <div className={container}>
                <input className={input} type="text" ref={playerName} />
                <button className={button} onClick={handleClick}>
                    Set Name
                </button>
            </div>
        </section>
    );
};

export default Player;
