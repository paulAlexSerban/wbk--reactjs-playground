import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';
import { list } from './data';
import { FaQuoteRight } from 'react-icons/fa';

// Type assertion to bypass React 18 compatibility issues
const SliderComponent = Slider as any;

const SlickCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        // fade: true,
        autoplay: true,
        autoplaySpeed: 1000,
        pauseOnHover: true,
    };

    return (
        <section className="slick-container">
            <SliderComponent {...settings}>
                {list.map((person) => {
                    const { id, image, name, title, quote } = person;
                    return (
                        <article key={id}>
                            <img src={image} alt={name} className="person-img" />
                            <h5 className="name">{name}</h5>
                            <p className="title">{title}</p>
                            <p className="text">{quote}</p>
                            <FaQuoteRight className="icon" />
                        </article>
                    );
                })}
            </SliderComponent>
        </section>
    );
};

export default SlickCarousel;
