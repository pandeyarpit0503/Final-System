const API_BASE_URL = 'http://localhost:8081/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'An error occurred');
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Auth API
export const authAPI = {
  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

// Restaurant API
export const restaurantAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    return handleResponse(response);
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    return handleResponse(response);
  },

  async search(query: string) {
    const response = await fetch(`${API_BASE_URL}/restaurants/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  async getOpen() {
    const response = await fetch(`${API_BASE_URL}/restaurants/open`);
    return handleResponse(response);
  },
};

// Menu Item API
export const menuItemAPI = {
  async getByRestaurant(restaurantId: string) {
    const response = await fetch(`${API_BASE_URL}/menu-items/restaurant/${restaurantId}`);
    return handleResponse(response);
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`);
    return handleResponse(response);
  },
};

// Order API
export const orderAPI = {
  async create(data: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getByUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getByOrderNumber(orderNumber: string) {
    const response = await fetch(`${API_BASE_URL}/orders/order-number/${orderNumber}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updateStatus(orderId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status/${status}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async cancel(id: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  restaurant: restaurantAPI,
  menuItem: menuItemAPI,
  order: orderAPI,
};
