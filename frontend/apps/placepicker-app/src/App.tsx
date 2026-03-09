import { useRef, useState, useCallback } from 'react';

import Places, { Place } from './components/Places.tsx';
import { AVAILABLE_PLACES } from './data.ts';
import Modal from './components/Modal.tsx';
import DeleteConfirmation from './components/DeleteConfirmation.tsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.ts';
import { useEffect } from 'react';
// using this outside of App() because it needs to be run only once when the app is loaded
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces') as string) || [];
const storedPlaces = storedIds
    // map the stored ids to the actual places
    .map((id: string) =>
        AVAILABLE_PLACES
            // find the place with the given id
            .find((place) => place.id === id)
    );

function App() {
    const selectedPlace = useRef<string>('');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [pickedPlaces, setPickedPlaces] = useState<Place[]>(storedPlaces);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

    // // example redundant usage of useEffect to persist the selected places in localStorage
    // useEffect(() => {
    //     const storedIds = JSON.parse(localStorage.getItem('selectedPlaces') as string) || [];
    //     const storedPlaces = storedIds
    //         // map the stored ids to the actual places
    //         .map((id: string) =>
    //             AVAILABLE_PLACES
    //                 // find the place with the given id
    //                 .find((place) => place.id === id)
    //         )
    //     setPickedPlaces(storedPlaces);
    // }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const sortedPlaces = sortPlacesByDistance(
                AVAILABLE_PLACES,
                position.coords.latitude,
                position.coords.longitude
            );
            setAvailablePlaces(sortedPlaces);
        });
    }, []);

    const handleStartRemovePlace = (id: string) => {
        setModalIsOpen(true);
        selectedPlace.current = id;
    };

    const handleStopRemovePlace = () => {
        setModalIsOpen(false);
    };

    const handleSelectPlace = (id: string) => {
        setPickedPlaces((prevPickedPlaces) => {
            if (prevPickedPlaces.some((place) => place.id === id)) {
                return prevPickedPlaces;
            }
            const place = AVAILABLE_PLACES.find((place) => place.id === id);
            if (!place) {
                return prevPickedPlaces;
            }
            return [place, ...prevPickedPlaces];
        });

        // persist selected place ids in localStorage to be able to restore the selection when the page is reloaded
        // useEffect is not used here because we want to persist the selection immediately
        // useEffect can't be used here because it is inside a function and violates the rules of hooks
        const storedIds = JSON.parse(localStorage.getItem('selectedPlaces') as string) || [];
        if (storedIds.indexOf(id) === -1) {
            localStorage.setItem('selectedPlaces', JSON.stringify([...storedIds, id]));
        }
    };

    /**
     * useCallback makes sure that the function is not recreated on every render cycle
     * This is important because the function is passed as a prop to a child component
     * and we don't want the child component to re-render unnecessarily
     * this way, we can use the function as a dependency in the useEffect hook in the child component such as in DeleteConfirmation.tsx
     */

    const handleRemovePlace = useCallback(() => {
        setPickedPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current));
        setModalIsOpen(false);

        // persist selected place ids in localStorage to be able to restore the selection when the page is reloaded
        const storedIds = JSON.parse(localStorage.getItem('selectedPlaces') as string) || [];
        // remove the id of the place that was just removed from the list of selected place ids
        localStorage.setItem(
            'selectedPlaces',
            JSON.stringify(storedIds.filter((id: string) => id !== selectedPlace.current))
        );
    }, []);

    return (
        <>
            <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
                <DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
            </Modal>

            <header>
                <img src={logoImg} alt="Stylized globe" />
                <h1>PlacePicker</h1>
                <p>Create your personal collection of places you would like to visit or you have visited.</p>
            </header>
            <main>
                <Places
                    title="I'd like to visit ..."
                    fallbackText={'Select the places you would like to visit below.'}
                    places={pickedPlaces}
                    onSelectPlace={handleStartRemovePlace}
                />
                <Places
                    title="Available Places"
                    places={availablePlaces}
                    onSelectPlace={handleSelectPlace}
                    fallbackText="Sorting places by distance..."
                />
            </main>
        </>
    );
}

export default App;
