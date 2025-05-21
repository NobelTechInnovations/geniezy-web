'use client';

import { Repository } from './Repository';

class CollectionRepository {
    async getCollections() {
        try {
            const response = await Repository.get('/collections');
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async getCollectionBySlug(slug) {
        try {
            const response = await Repository.get(`/collections?slug=${slug}`);
            return response.data[0];
        } catch (error) {
            return null;
        }
    }

    async getProductsByCollectionSlug(slug) {
        const reponse = await Repository.get(
            `/collections?slug_in=${slug}`
        )
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    return { items: response.data[0].products };
                } else {
                    return null;
                }
                return response.data;
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                return null;
            });
        return reponse;
    }

    async getProductsByCategorySlug(slug) {
        const reponse = await Repository.get(
            `/product-categories?slug_in=${slug}`
        )
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    return { items: response.data[0].products };
                } else {
                    return null;
                }
                return response.data;
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                return null;
            });
        return reponse;
    }
}

export default new CollectionRepository();
