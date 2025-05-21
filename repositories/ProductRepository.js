'use client';

import { Repository } from './Repository';

class ProductRepository {
    // Fetch products with query params
    async getRecords(params) {
        try {
            const response = await Repository.get('/products', { params });
            return response.data;
        } catch (error) {
            return { error: JSON.stringify(error) };
        }
    }

    // Get products with params, returns array or null
    async getProducts(params) {
        const response = await Repository.get('/products', { params });
        return response.data;
    }

    // Get all brands
    async getBrands() {
        try {
            const response = await Repository.get('/brands');
            return response.data;
        } catch (error) {
            return { error: JSON.stringify(error) };
        }
    }

    // Get all product categories
    async getProductCategories() {
        try {
            const response = await Repository.get('/product-categories');
            return response.data;
        } catch (error) {
            return { error: JSON.stringify(error) };
        }
    }

    // Get total number of products
    async getTotalRecords() {
        try {
            const response = await Repository.get('/products/count');
            return response.data;
        } catch (error) {
            return { error: JSON.stringify(error) };
        }
    }

    // Get product by ID
    async getProductsById(id) {
        const response = await Repository.get(`/products/${id}`);
        return response.data;
    }

    // Get product category by slug
    async getProductsByCategory(slug) {
        try {
            const response = await Repository.get('/product-categories', { params: { slug } });
            if (response.data && response.data.length > 0) {
                return response.data[0];
            }
            return null;
        } catch {
            return null;
        }
    }

    // Get brand by slug
    async getProductsByBrand(slug) {
        try {
            const response = await Repository.get('/brands', { params: { slug } });
            if (response.data && response.data.length > 0) {
                return response.data[0];
            }
            return null;
        } catch {
            return null;
        }
    }

    // Get products by multiple IDs with query string like "id_in=1&id_in=2"
    async getProductsByIds(ids) {
        const response = await Repository.get(`/products?${ids}`);
        return response.data;
    }

    async getProductById(id) {
        const response = await Repository.get(`/products/${id}`);
        return response.data;
    }
}

export default new ProductRepository();
