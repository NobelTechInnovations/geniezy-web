/*
 * React template helpers
 * Author: Nouthemes
 * Developed: diaryforlife
 * */

'use client';

import ProductRepository from '@/repositories/ProductRepository';
import CollectionRepository from '@/repositories/CollectionRepository';

export async function getProductsByCollectionHelper(
    collectionSlug,
    pageSize = 8
) {
    let products = [];
    if (collectionSlug) {
        products = await ProductRepository.getProducts({
            _limit: pageSize,
            collection_slug: collectionSlug,
        });
    }
    
    return products;
}

export async function getProductsByCategoriesHelper(slug) {
    let products = [];
    if (slug) {
        products = await ProductRepository.getProductsByCategory(slug);
    }
    return products;
}

export async function getProductsByBrandHelper(slug) {
    let products = [];
    if (slug) {
        products = await ProductRepository.getProductsByBrand(slug);
    }
    return products;
}
