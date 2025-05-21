'use client';

import React from 'react';
import Link from 'next/link';
import ModuleProductActions from '@/components/elements/products/modules/ModuleProductActions';
import useProduct from '@/hooks/useProduct';
import Rating from '../Rating';

const Product = ({ product }) => {
    const { thumbnailImage, price, badge, title } = useProduct();
    return (
        <div className="ps-product">
            <div className="ps-product__thumbnail">
                <Link href={`/product/${product.id}`}>
                    {thumbnailImage(product)}
                </Link>
                {badge(product)}
                <ModuleProductActions product={product} />
            </div>
            <div className="ps-product__container">
                <Link href="/shop" className="ps-product__vendor">
                    Young Shop
                </Link>
                <div className="ps-product__content">
                    {title(product)}
                    <div className="ps-product__rating">
                        <Rating />
                        <span>02</span>
                    </div>
                    {price(product)}
                </div>
                <div className="ps-product__content hover">
                    {title(product)}
                    {price(product)}
                </div>
            </div>
        </div>
    );
};

export default Product;
