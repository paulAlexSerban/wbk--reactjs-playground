export type TourProps = {
    id: number;
    image: string;
    info: string;
    name: string;
    price: number;
    removeTour: (id: number) => void;
};

export type ToursProps = {
    tours: TourProps[];
    removeTour: (id: number) => void;
};
