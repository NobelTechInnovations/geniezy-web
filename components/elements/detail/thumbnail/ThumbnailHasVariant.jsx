import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import NextArrow from '~/components/elements/carousel/NextArrow';
import PrevArrow from '~/components/elements/carousel/PrevArrow';
import { baseUrl } from '~/repositories/Repository';

const ThumbnailHasVariant = ({ product }) => {
    const [galleryCarousel, setGalleryCarousel] = useState(null);
    const [variantCarousel, setVariantCarousel] = useState(null);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [lightboxSlides, setLightboxSlides] = useState([]);
    
    const slider1 = useRef(null);
    const slider2 = useRef(null);

    const handleOpenLightbox = (e, imageIndex) => {
        e.preventDefault();
        setPhotoIndex(imageIndex);
        setIsOpen(true);
    };

    useEffect(() => {
        setGalleryCarousel(slider1.current);
        setVariantCarousel(slider2.current);
        
        // Create lightbox slides
        const slides = product.images.map(variant => ({
            src: `${baseUrl}${variant.url}`
        }));
        setLightboxSlides(slides);
    }, [product]);

    const gallerySetting = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const variantSetting = {
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    dots: false,
                    arrows: false,
                    vertical: false,
                    infinite: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    dots: false,
                    arrows: false,
                    vertical: false,
                    infinite: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    dots: false,
                    arrows: false,
                    vertical: false,
                    infinite: false,
                },
            },
        ],
    };

    return (
        <div className="ps-product__thumbnail" data-vertical="true">
            <figure>
                <div className="ps-wrapper">
                    <Slider
                        {...gallerySetting}
                        ref={slider1}
                        asNavFor={variantCarousel}
                        className="ps-product__gallery ps-carousel inside">
                        {product.images.map((variant, index) => (
                            <div className="item" key={variant.id}>
                                <a
                                    href="#"
                                    onClick={(e) =>
                                        handleOpenLightbox(e, index)
                                    }>
                                    <img
                                        src={`${baseUrl}${variant.url}`}
                                        alt="martfury-image"
                                    />
                                </a>
                            </div>
                        ))}
                    </Slider>
                </div>
            </figure>
            <Slider
                asNavFor={galleryCarousel}
                ref={slider2}
                swipeToSlide={true}
                arrows={false}
                slidesToShow={3}
                vertical={true}
                focusOnSelect={true}
                {...variantSetting}
                className="ps-product__variants">
                {product.images.map((variant) => (
                    <div className="item" key={variant.id}>
                        <img
                            src={`${baseUrl}${variant.url}`}
                            alt="martfury-image"
                        />
                    </div>
                ))}
            </Slider>
            <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                slides={lightboxSlides}
                index={photoIndex}
                carousel={{ preload: 3 }}
            />
        </div>
    );
};

export default ThumbnailHasVariant;
