import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  versions: {
    v1: {
      shop: 'v1/shop',
      catalog: 'v1/shop/gz/catalog',
    }
  }
};

// Create an Axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get versioned endpoint
const getVersionedEndpoint = (version, service, endpoint) => {
  const basePath = API_CONFIG.versions[version]?.[service];
  if (!basePath) {
    throw new Error(`Invalid version or service: ${version}/${service}`);
  }
  return `${basePath}/${endpoint}`.replace(/\/+/g, '/');
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage if needed
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Implement token refresh logic if needed
      // or redirect to login
    }
    
    return Promise.reject(error);
  }
);

// Category API endpoints
export const categoryApi = {
  /**
   * Get all parent categories
   * @param {string} version - API version (default: 'v1')
   * @returns {Promise} Promise object with category data
   */
  getParentCategories: async (version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'catalog', 'listing');
      const response = await api.get(endpoint, {
        params: {
          tree: false,
          'main-category': ''
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get child categories for a given main category id
   * @param {string} mainCategoryId - The id of the main category
   * @param {string} version - API version (default: 'v1')
   * @returns {Promise} Promise object with child category data
   */
  getChildCategories: async (mainCategoryId, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'catalog', 'listing');
      const response = await api.get(endpoint, {
        params: {
          tree: false,
          'main-category': mainCategoryId,
          limit: 4
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get products for a given category id
   * @param {string} categoryId - The id of the category
   * @param {string} version - API version (default: 'v1')
   * @returns {Promise} Promise object with category products data
   */
  getCategoryProducts: async (categoryId, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'catalog', `${categoryId}/items`);
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const productApi = {
  /**
   * Get product details by gspin
   * @param {string} gspin - The product gspin
   * @param {Object} params - Query parameters
   * @param {string} params.pid - Product ID
   * @param {string} params.type - Product type (simple/variable)
   * @param {string} params.p_sku - Product SKU
   * @param {string} version - API version (default: 'v1')
   * @returns {Promise} Promise object with product data
   */
  getProductInfo: async (gspin, queryParams = {}, version = 'v1') => {
    try {
      if (!gspin) {
        throw new Error('GSPIN is required');
      }

      const { pid, type, p_sku } = queryParams;
      if (!pid) {
        throw new Error('Product ID is required');
      }

      const endpoint = getVersionedEndpoint(version, 'catalog', `listing/${gspin}/info`);
      console.log('Calling product info API:', endpoint);
      
      const response = await api.get(endpoint, {
        params: {
          pid,
          type,
          p_sku
        }
      });

      console.log('Product info API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.getProductInfo:', error);
      throw error;
    }
  },

  getProductImages: async (gspin, queryParams = {}) => {
    try {
      if (!gspin) {
        throw new Error('GSPIN is required');
      }

      const { pid, type, p_sku } = queryParams;
      if (!pid) {
        throw new Error('Product ID is required');
      }

      const endpoint = getVersionedEndpoint('v1', 'catalog', `listing/${gspin}/images`);
      console.log('Calling product images API:', endpoint);
      
      const response = await api.get(endpoint, {
        params: {
          pid,
          type,
          p_sku
        }
      });

      console.log('Product images API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.getProductImages:', error);
      throw error;
    }
  },

  /**
   * Get product recommendations for a given category and item
   * @param {string} categoryId - The category ID
   * @param {string} itemId - The item ID
   * @param {string} version - API version (default: 'v1')
   * @returns {Promise} Promise object with recommended products data
   */
  getProductRecommendations: async (categoryId, itemId, version = 'v1') => {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const endpoint = getVersionedEndpoint(version, 'catalog', `${categoryId}/item/${itemId}/suggestions`);
      console.log('Calling product recommendations API:', endpoint);
      
      const response = await api.get(endpoint);
      console.log('Product recommendations API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.getProductRecommendations:', error);
      throw error;
    }
  }
};

export default api;