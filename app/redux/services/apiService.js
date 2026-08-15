import axios from 'axios';
import { getSessionId } from '../../services/browsingHistory/sessionId';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  versions: {
    v1: {
      shop: 'v1/shop',
      catalog: 'v1/shop/gz/catalog',
      orders: 'v1/shop/orders',
      events: 'v1/shop/gz/events',
      homeFeed: 'v1/shop/gz/home-feed',
      recommendations: 'v1/shop/gz/recommendations',
      wishlist: 'v1/shop/gz/wishlist',
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
    // Get token from localStorage — 'geniezy_token' is the actual key used
    // everywhere else in the app (login, checkout, logout); this previously
    // read a 'token' key that nothing ever wrote, so it silently never
    // attached auth for any call that didn't set the header manually itself.
    const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
    
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
   * @param {Object} filters - Optional filters/location
   * @param {number} filters.lat - Buyer latitude (from getLocationFromLocalStorage)
   * @param {number} filters.lng - Buyer longitude
   * @param {number} filters.minPrice - Minimum price filter
   * @param {number} filters.maxPrice - Maximum price filter
   * @param {string} filters.brand - Comma-separated brand names
   * @param {string} filters.subcategory - Comma-separated subcategory ids
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Page size
   * @param {boolean} filters.includeOutOfRange - Also return products from
   *   sellers outside the buyer's delivery range, each annotated with
   *   `delivery_type: 'same_day' | 'standard'` instead of being hidden.
   * @param {string} version - API version (default: 'v1')
   * @returns {Promise} Promise object with category products data
   */
  getCategoryProducts: async (categoryId, filters = {}, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'catalog', `${categoryId}/items`);
      const { lat, lng, minPrice, maxPrice, brand, subcategory, page, limit, includeOutOfRange } = filters;
      const response = await api.get(endpoint, {
        params: { lat, lng, minPrice, maxPrice, brand, subcategory, page, limit, includeOutOfRange }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Backend-owned, fully-tracked search (Phase 4, M4) — powers the dedicated
// /search results page. Distinct from the Algolia-backed live typeahead
// dropdown in Search.js, which is unchanged and still hits Algolia directly
// for fast as-you-type suggestions.
export const searchApi = {
  search: async (params = {}, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'catalog', 'search');
      const { q, lat, lng, page, limit, minPrice, maxPrice, brand, anonId } = params;
      const response = await api.get(endpoint, {
        params: { q, lat, lng, page, limit, minPrice, maxPrice, brand, anonId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
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
      
      const response = await api.get(endpoint, {
        params: {
          pid,
          type,
          p_sku
        }
      });

      return response.data;
    } catch (error) {
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
      
      const response = await api.get(endpoint, {
        params: {
          pid,
          type,
          p_sku
        }
      });

      return response.data;
    } catch (error) {
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

      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Unscoped, location/price/brand-filterable product listing — groundwork
   * for a future "products near you" home-page section.
   * @param {Object} filters - lat, lng, minPrice, maxPrice, brand, category, page, limit
   * @param {string} version - API version (default: 'v1')
   */
  getNearbyProducts: async (filters = {}, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'catalog', 'nearby');
      const { lat, lng, minPrice, maxPrice, brand, category, page, limit } = filters;
      const response = await api.get(endpoint, {
        params: { lat, lng, minPrice, maxPrice, brand, category, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Customer's own order history (auth required — the interceptor above
// attaches the geniezy_token automatically).
export const orderApi = {
  /**
   * All orders placed by the logged-in customer, newest first. A single
   * checkout can produce several orders (one per seller) — each is
   * returned as its own entry, not grouped.
   */
  getMyOrders: async (version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'orders', '');
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /** Single order detail, including delivery address. */
  getOrderDetail: async (orderId, version = 'v1') => {
    try {
      if (!orderId) throw new Error('Order ID is required');
      const endpoint = getVersionedEndpoint(version, 'orders', orderId);
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Fire-and-forget behavior tracking (view/search events) — powers the
// home feed's personalization. Works for guests (anonId) and logged-in
// customers alike (the interceptor attaches the auth header when present;
// the backend's optionalAuth middleware never requires it).
// Best-effort device-type guess from viewport width — matches the
// mobile/tablet/desktop breakpoints used elsewhere in the app (Header.js,
// resize_window presets). Not exact device detection, just a coarse signal
// for organic-reach-by-device reporting.
const guessDeviceType = () => {
  if (typeof window === 'undefined') return null;
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
};

export const eventApi = {
  /**
   * @param {Object} event
   * @param {'view_product'|'view_category'|'search'|'add_to_cart'|'purchase'|
   *   'product_impression'|'product_click'|'product_scroll'|'product_content_read'|'product_image_view'|
   *   'remove_from_cart'|'wishlist'|'checkout_started'|
   *   'recommendation_impression'|'recommendation_click'} event.eventType
   * @param {string} [event.productId]
   * @param {string} [event.categoryId]
   * @param {string} [event.searchQuery]
   * @param {string} [event.anonId]
   * @param {string} [event.source] - homepage|category|search|pdp|cart|checkout
   * @param {number} [event.position] - 1-based ranking position, for click/impression events
   * @param {string} [event.placement] - homepage|category|pdp_similar|pdp_fbt|cart|search (recommendation rail)
   * @param {string[]} [event.productIds] - batch impression: every product shown
   * @param {number[]} [event.positions] - parallel array to productIds
   * @param {string} [event.basedOn] - category_affinity|co_view|co_purchase|trending|default
   * @param {string} [event.sessionId] - defaults to the current tab's session id if omitted
   * @param {string} [event.deviceType] - defaults to a viewport-width guess if omitted
   */
  track: async (event, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'events', 'track');
      const payload = {
        sessionId: getSessionId(),
        deviceType: guessDeviceType(),
        ...event, // caller-supplied values win if explicitly passed
      };
      // Never let a tracking failure surface to the caller — this must
      // not block or error out the actual page the user is looking at.
      await api.post(endpoint, payload).catch(() => {});
    } catch {
      // swallow — tracking is best-effort only
    }
  },
};

// The buyer's dynamic home page feed — cold-start default sections until
// enough behavior signal exists for this identity, then personalized.
export const homeFeedApi = {
  getFeed: async (params = {}, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'homeFeed', '');
      const { lat, lng, anonId } = params;
      const response = await api.get(endpoint, { params: { lat, lng, anonId } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Context-aware recommendations (Phase 4, M3) — one endpoint, ranked
// product rails, reused on every major page via <RecommendationRail>.
export const recommendationApi = {
  /**
   * @param {Object} params
   * @param {'home'|'category'|'search'|'pdp'|'cart'} params.context
   * @param {string} [params.categoryId]
   * @param {string} [params.productId]
   * @param {string} [params.searchQuery]
   * @param {string[]} [params.cartProductIds]
   * @param {number} [params.lat]
   * @param {number} [params.lng]
   * @param {string} [params.anonId]
   */
  getRecommendations: async (params = {}, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'recommendations', '');
      const { context, categoryId, productId, searchQuery, cartProductIds, lat, lng, anonId } = params;
      const response = await api.get(endpoint, {
        params: {
          context, categoryId, productId, searchQuery, lat, lng, anonId,
          cartProductIds: Array.isArray(cartProductIds) ? cartProductIds.join(',') : cartProductIds,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Wishlist (Phase 4, M9) — all routes require auth; the request interceptor
// above already attaches the token when one exists, so a logged-out call
// simply comes back 401 and callers should treat that as "not wishlisted /
// prompt login" rather than a hard error.
export const wishlistApi = {
  list: async (version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'wishlist', '');
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  toggle: async (payload, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'wishlist', 'toggle');
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  check: async (productId, version = 'v1') => {
    try {
      const endpoint = getVersionedEndpoint(version, 'wishlist', `check/${productId}`);
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { getVersionedEndpoint };
export default api;