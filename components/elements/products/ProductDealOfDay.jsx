'use client';

import React from 'react';
import Link from 'next/link';
import Rating from '../Rating';
import useProduct from '@/hooks/useProduct';

const ProductDealOfDay = ({ product }) => {
    const { thumbnailImage, price, title } = useProduct();
    
    return (
        <div className="ps-product ps-product--inner">
            <div className="ps-product__thumbnail">
                <Link href={`/product/${product.id}`}>
                    {thumbnailImage(product)}
                </Link>
                {product.badge ? <div className="ps-product__badge">{product.badge}</div> : ''}
            </div>
            <div className="ps-product__container">
                <div className="ps-product__content">
                    {title(product)}
                    <div className="ps-product__rating">
                        <Rating rating={product.rating} />
                        <span>{product.ratingCount}</span>
                    </div>
                    {price(product)}
                </div>
            </div>
        </div>
    );
};

export default ProductDealOfDay;
