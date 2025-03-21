/**
 * Central configuration for the frontend application
 */

// API base URL - use environment variable with fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qgx127qq-3000.use.devtunnels.ms';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VERIFY_TOKEN: `${API_BASE_URL}/api/auth/verify`,
  
  // Item endpoints
  ITEMS: `${API_BASE_URL}/api/items`,
  ITEM: (id) => `${API_BASE_URL}/api/items/${id}`,
  
  // User endpoints
  USER_ITEMS: `${API_BASE_URL}/api/user/items`,
};

// Application settings
export const APP_CONFIG = {
  APP_NAME: 'Campus Connect',
  ITEMS_PER_PAGE: 12,
}; 