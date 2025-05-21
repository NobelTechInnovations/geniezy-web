'use client';

import React from 'react';
// import LazyLoad from 'react-lazyload';
import { baseUrl } from '@/repositories/Repository';
import Link from 'next/link';

export function formatCurrency(num) {
    if (num !== undefined) {
        return parseFloat(num)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
        return '0';
    }
}

export function getColletionBySlug(collections, slug) {
    if (collections.length > 0) {
        const result = collections.find(
            (item) => item.slug === slug.toString()
        );
        return result ? result.products : [];
    }
    return [];
}

export function getItemBySlug(items, slug) {
    if (items && items.length > 0) {
        const result = items.find((item) => item.slug === slug);
        return result;
    }
    return null;
}

export function convertSlugsQueryString(payload) {
    if (payload.length === 0) return '';
    return payload.map((item) => `slug_in=${item}`).join('&');
}

export function StrapiProductPriceExpanded(product) {
    if (product.is_sale === true) {
        return (
            <p className="ps-product__price sale">
                ${formatCurrency(product.sale_price)}
                <del className="ml-2">${formatCurrency(product.price)}</del>
                <small>18% off</small> {/* Consider calculating discount dynamically */}
            </p>
        );
    }
    return (
        <p className="ps-product__price">
            ${formatCurrency(product.price)}
        </p>
    );
}

export function StrapiProductThumbnail(product) {
    const imgSrc = product.thumbnail ? `${baseUrl}${product.thumbnail.url}` : '/static/img/not-found.jpg';
    const altText = product.thumbnail?.alternativeText || product.title || 'product image';

    return (
        <Link href={`/product/${product.id}`}>
            <img src={imgSrc} alt={altText} />
        </Link>
    );
}
