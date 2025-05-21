'use client';

import { Repository, baseUrl } from './Repository';

class MediaRespository {
    async getBannersBySlug(payload) {
        try {
            const response = await Repository.get(`${baseUrl}/banners?slug=${payload}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async getPromotionsBySlug(payload) {
        try {
            const response = await Repository.get(
                `${baseUrl}/promotions?slug=${payload}`
            );
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

export default new MediaRespository();
