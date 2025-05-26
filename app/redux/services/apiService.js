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
          limit: 3
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;