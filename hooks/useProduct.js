'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { baseUrl } from '@/repositories/Repository';
import { formatCurrency } from '@/utilities/product-helper';

function getImageURL(source, size) {
    if (!source) return '/static/img/undefined-product-thumbnail.jpg';
    
    if (source.formats && source.formats[size]) {
        return `${baseUrl}${source.formats[size].url}`;
    } else {
        return `${baseUrl}${source.url}`;
    }
}

export default function useProduct() {
    return {
        thumbnailImage: (product) => {
            if (product && product.thumbnail) {
                return (
                    <img
                        src={getImageURL(product.thumbnail, 'medium')}
                        alt={product.title || 'Product Image'}
                    />
                );
            } else {
                return (
                    <img
                        src="/static/img/undefined-product-thumbnail.jpg"
                        alt="undefined-product"
                    />
                );
            }
        },
        
        price: (product) => {
            let view;
            if (product.sale_price) {
                view = (
                    <p className="ps-product__price sale">
                        <span>${formatCurrency(product.price)}</span>
                        ${formatCurrency(product.sale_price)}
                    </p>
                );
            } else {
                view = (
                    <p className="ps-product__price">
                        ${formatCurrency(product.price)}
                    </p>
                );
            }
            return view;
        },
        
        title: (product) => {
            return (
                <Link href={`/product/${product.id}`} className="ps-product__title">
                    {product.title}
                </Link>
            );
        },
        
        badge: (product) => {
            let view = null;
            if (product.badge && product.badge !== null) {
                view = <div className="ps-product__badge">{product.badge}</div>;
            }
            return view;
        }
    };
}
