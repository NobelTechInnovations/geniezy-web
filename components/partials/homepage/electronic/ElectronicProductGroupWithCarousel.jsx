'use client';

import React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { generateTempArray } from '@/utilities/common-helpers';
import SkeletonProduct from '@/components/elements/skeletons/SkeletonProduct';
import Product from '@/components/elements/products/Product';

const ElectronicProductGroupWithCarousel = ({ products, type = 'normal' }) => {
    const carouselFullwidth = {
        dots: false,
        infinite: products && products.length > 7 ? true : false,
        speed: 750,
        slidesToShow: 7,
        slidesToScroll: 3,
        arrows: true,
        responsive: [
            {
                breakpoint: 1750,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 3,
                    dots: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 1366,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,
                    dots: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    dots: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                    dots: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    dots: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: true,
                    arrows: false,
                },
            },
        ],
    };

    let productItemsView;
    if (products && products.length > 0) {
        if (products && products.length > 0) {
            const slideItems = products.map((item) => (
                <div className="item" key={item.id}>
                    <Product product={item} />
                </div>
            ));
            if (type === 'fullwidth') {
                productItemsView = (
                    <Slider {...carouselFullwidth} className="ps-carousel outside">
                        {slideItems}
                    </Slider>
                );
            }
        }
    } else {
        productItemsView = <p>No products found</p>;
    }

    return (
        <div className="ps-block--products-of-category">
            <div className="ps-block__content">{productItemsView}</div>
        </div>
    );
};

export default ElectronicProductGroupWithCarousel;
