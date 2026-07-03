import { Category, Product, PaginatedResponse, InventoryItem, ProductCreateInput } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Helper to build query strings from object parameters
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Generic request helper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || 'An error occurred while fetching data.',
      errors: errorData.errors || null,
    };
  }

  return response.json() as Promise<T>;
}

export const apiService = {
  /**
   * Fetch all categories
   */
  getCategories: async (): Promise<{ data: Category[] }> => {
    return apiFetch<{ data: Category[] }>('/categories');
  },

  /**
   * Fetch paginated products with optional filters
   */
  getProducts: async (filters: {
    category_id?: string;
    color?: string;
    page?: number;
    per_page?: number;
  } = {}): Promise<PaginatedResponse<Product>> => {
    const query = buildQueryString({
      category_id: filters.category_id,
      color: filters.color,
      page: filters.page,
      per_page: filters.per_page,
    });
    return apiFetch<PaginatedResponse<Product>>(`/products${query}`);
  },

  /**
   * Fetch paginated inventory list for the admin table
   */
  getInventory: async (filters: {
    search?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    per_page?: number;
  } = {}): Promise<PaginatedResponse<InventoryItem>> => {
    const query = buildQueryString({
      search: filters.search,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
      page: filters.page,
      per_page: filters.per_page,
    });
    return apiFetch<PaginatedResponse<InventoryItem>>(`/products/inventory${query}`);
  },

  /**
   * Fetch all distinct variant colors
   */
  getColors: async (): Promise<{ data: string[] }> => {
    return apiFetch<{ data: string[] }>('/colors');
  },

  /**
   * Create a new product with variants
   */
  createProduct: async (data: ProductCreateInput): Promise<{ data: Product }> => {
    return apiFetch<{ data: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Fetch a single product by ID
   */
  getProduct: async (id: number | string): Promise<{ data: Product }> => {
    return apiFetch<{ data: Product }>(`/products/${id}`);
  },

  /**
   * Update a product by ID
   */
  updateProduct: async (id: number | string, data: any): Promise<{ data: Product }> => {
    return apiFetch<{ data: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a product by ID
   */
  deleteProduct: async (id: number | string): Promise<void> => {
    return apiFetch<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
