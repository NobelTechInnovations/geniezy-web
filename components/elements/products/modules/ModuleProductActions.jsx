'use client';

import React from 'react';

const ModuleProductActions = ({ product }) => {
    const handleAddItemToCart = (e) => {
        e.preventDefault();
        console.log('Add to cart:', product);
        // Here would be the actual cart logic
    };

    const handleAddItemToWishlist = (e) => {
        e.preventDefault();
        console.log('Add to wishlist:', product);
        // Here would be the actual wishlist logic
    };

    const handleAddItemToCompare = (e) => {
        e.preventDefault();
        console.log('Add to compare:', product);
        // Here would be the actual compare logic
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        console.log('Quick view:', product);
        // Here would be the actual quick view logic
    };

    return (
        <ul className="ps-product__actions">
            <li>
                <a
                    href="#"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Add To Cart"
                    onClick={handleAddItemToCart}>
                    <i className="icon-bag2"></i>
                </a>
            </li>
            <li>
                <a
                    href="#"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Quick View"
                    onClick={handleQuickView}>
                    <i className="icon-eye"></i>
                </a>
            </li>
            <li>
                <a
                    href="#"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Add to wishlist"
                    onClick={handleAddItemToWishlist}>
                    <i className="icon-heart"></i>
                </a>
            </li>
            <li>
                <a
                    href="#"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Compare"
                    onClick={handleAddItemToCompare}>
                    <i className="icon-chart-bars"></i>
                </a>
            </li>
        </ul>
    );
};

export default ModuleProductActions; 