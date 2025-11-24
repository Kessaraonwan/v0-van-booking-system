// API Client for Van Booking System
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Token management
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const setRefreshToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token);
  }
};

export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401 && token) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry request with new token
          return apiRequest(endpoint, options);
        } else {
          removeTokens();
          window.location.href = '/login';
        }
      }

      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.success) {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      setUser(data.data.user);
    }
    
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.success) {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      setUser(data.data.user);
    }
    
    return data;
  },

  logout: () => {
    removeTokens();
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (passwords) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  },
};

// Schedule API
export const scheduleAPI = {
  search: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/schedules/search?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/schedules/${id}`);
  },

  getSeats: async (id) => {
    return apiRequest(`/schedules/${id}/seats`);
  },
};

// Booking API
export const bookingAPI = {
  create: async (bookingData) => {
    return apiRequest('/bookings/create', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async (status = 'all') => {
    return apiRequest(`/bookings/my-bookings?status=${status}`);
  },

  getById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  cancel: async (id, reason) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// Route API
export const routeAPI = {
  getAll: async () => {
    return apiRequest('/routes');
  },

  getById: async (id) => {
    return apiRequest(`/routes/${id}`);
  },

  getPickupPoints: async (routeId) => {
    return apiRequest(`/routes/${routeId}/pickup-points`);
  },

  getDropoffPoints: async (routeId) => {
    return apiRequest(`/routes/${routeId}/dropoff-points`);
  },
};

// Van API
export const vanAPI = {
  getAll: async () => {
    return apiRequest('/vans');
  },

  getById: async (id) => {
    return apiRequest(`/vans/${id}`);
  },
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard/stats');
  },

  getTodaySchedules: async () => {
    return apiRequest('/admin/dashboard/today-schedules');
  },

  getRecentBookings: async (limit = 10) => {
    return apiRequest(`/admin/dashboard/recent-bookings?limit=${limit}`);
  },

  // Bookings
  getAllBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/bookings?${queryString}`);
  },

  getBookingDetails: async (id) => {
    return apiRequest(`/admin/bookings/${id}`);
  },

  updateBookingStatus: async (id, status) => {
    return apiRequest(`/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Schedules
  getAllSchedules: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/schedules?${queryString}`);
  },

  createSchedule: async (scheduleData) => {
    return apiRequest('/admin/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  },

  updateSchedule: async (id, scheduleData) => {
    return apiRequest(`/admin/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  },

  deleteSchedule: async (id) => {
    return apiRequest(`/admin/schedules/${id}`, {
      method: 'DELETE',
    });
  },

  // Vans
  getAllVans: async () => {
    return apiRequest('/admin/vans');
  },

  createVan: async (vanData) => {
    return apiRequest('/admin/vans', {
      method: 'POST',
      body: JSON.stringify(vanData),
    });
  },

  updateVan: async (id, vanData) => {
    return apiRequest(`/admin/vans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vanData),
    });
  },

  deleteVan: async (id) => {
    return apiRequest(`/admin/vans/${id}`, {
      method: 'DELETE',
    });
  },

  // Routes
  getAllRoutes: async () => {
    return apiRequest('/admin/routes');
  },

  createRoute: async (routeData) => {
    return apiRequest('/admin/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  updateRoute: async (id, routeData) => {
    return apiRequest(`/admin/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData),
    });
  },

  deleteRoute: async (id) => {
    return apiRequest(`/admin/routes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  authAPI,
  scheduleAPI,
  bookingAPI,
  routeAPI,
  vanAPI,
  adminAPI,
};
