'use client';

import React from 'react';
import Link from 'next/link';

const ProductOnCart = ({ product }) => {
    return (
        <div className="ps-product--cart-mobile">
            <div className="ps-product__thumbnail">
                <Link href={`/product/${product?.id}`}>
                    <img 
                        src={product?.thumbnail?.url || '/static/img/placeholder.jpg'} 
                        alt={product?.title || 'Product Image'} 
                    />
                </Link>
            </div>
            <div className="ps-product__content">
                <Link 
                    href={`/product/${product?.id}`}
                    className="ps-product__title"
                >
                    {product?.title || 'Product Name'}
                </Link>
                <p>
                    <small>
                        ${product?.price?.toFixed(2) || '0.00'} x {product?.quantity || 1}
                    </small>
                </p>
            </div>
        </div>
    );
};

export default ProductOnCart;
