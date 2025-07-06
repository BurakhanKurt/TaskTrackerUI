// API Konfigürasyonu
export const API_CONFIG = {
  // api url
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
    },
    TASKS: {
      GET_ALL: '/api/tasks',
      CREATE: '/api/tasks',
      CREATE_WITH_VALIDATION: '/api/tasks/with-validation',
      UPDATE: (id) => `/api/tasks/${id}`,
      UPDATE_TITLE: (id) => `/api/Tasks/${id}/title`,
      UPDATE_STATUS: (id) => `/api/Tasks/${id}/status`,
      UPDATE_DUE_DATE: (id) => `/api/Tasks/${id}/date`,
      COMPLETE: (id) => `/api/Tasks/${id}/complete`,
      DELETE: (id) => `/api/tasks/${id}`,
    },
  },
  
  // pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
};

export default API_CONFIG; 