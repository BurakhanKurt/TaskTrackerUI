import axios from 'axios';
import { API_CONFIG } from '../config/api';

// api url
const API_BASE_URL = API_CONFIG.BASE_URL;

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // token süresi dolmuş veya geçersiz, giriş sayfasına yönlendir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (response?.status === 429) {
      // rate limiting hatası - sadece mesajı göster
      const message = response.data?.messages || 'Çok fazla istek gönderdiniz. Lütfen bekleyin.';
      const retryAfter = response.data?.retryAfter || 60;
      
      // toast notification göster
      showRateLimitToast(message, retryAfter);
    }
    
    return Promise.reject(error);
  }
);

// toast notification
const showRateLimitToast = (message, retryAfter) => {
  // mevcut toastları temizle
  const existingToasts = document.querySelectorAll('.rate-limit-toast');
  existingToasts.forEach(toast => toast.remove());
  
  // yeni toast oluştur
  const toast = document.createElement('div');
  toast.className = 'rate-limit-toast fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm';
  
  toast.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium">${message}</p>
        ${retryAfter > 0 ? `<p class="text-xs mt-1 opacity-90">${retryAfter} saniye sonra tekrar deneyin</p>` : ''}
      </div>
      <div class="ml-4 flex-shrink-0">
        <button class="text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // 5 saniye sonra otomatik kaldır
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 5000);
};

// auth endpoints
export const authAPI = {
  // register
  register: (userData) => api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
  
  // login
  login: (credentials) => api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
};

// tasks endpoints
export const tasksAPI = {
  // pagination
  getAll: (params = {}) => {
    const {
      page = API_CONFIG.PAGINATION.DEFAULT_PAGE,
      pageSize = API_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
      statusFilter = null,
      searchTerm = null,
      endDate = null
    } = params;

    let url = `${API_CONFIG.ENDPOINTS.TASKS.GET_ALL}?page=${page}&pageSize=${pageSize}`;
    
    if (statusFilter !== null) {
      url += `&statusFilter=${statusFilter}`;
    }
    
    if (searchTerm) {
      url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    
    if (endDate) {
      url += `&dueDate=${endDate}`;
    }
    
    return api.get(url);
  },
  
  // create
  create: (taskData) => api.post(API_CONFIG.ENDPOINTS.TASKS.CREATE, taskData),
  
  // validation
  createWithValidation: (taskData) => 
    api.post(API_CONFIG.ENDPOINTS.TASKS.CREATE_WITH_VALIDATION, taskData),
  
  // update title
  updateTitle: (taskId, title) => 
    api.put(API_CONFIG.ENDPOINTS.TASKS.UPDATE_TITLE(taskId), { title }),
  
  // update status
  updateStatus: (taskId, isCompleted) => 
    api.put(API_CONFIG.ENDPOINTS.TASKS.UPDATE_STATUS(taskId), { isCompleted }),
  
  // update due date
  updateDueDate: (taskId, dueDate) => 
    api.put(API_CONFIG.ENDPOINTS.TASKS.UPDATE_DUE_DATE(taskId), { dueDate }),
  
  // complete
  complete: (taskId) => 
    api.put(API_CONFIG.ENDPOINTS.TASKS.COMPLETE(taskId)),
  
  // delete
  delete: (taskId) => 
    api.delete(API_CONFIG.ENDPOINTS.TASKS.DELETE(taskId)),
};

export default api; 