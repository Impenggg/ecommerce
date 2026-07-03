export interface Category {
  id: number;
  name: string;
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  size: string | null;
  color: string | null;
  price: string; // Cast as string in Laravel Resources decimal response
  stock_quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string | null;
  category_id: number;
  category?: Category;
  variants?: Variant[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface InventoryItem {
  id: number;
  title: string;
  category_name: string;
  variants_count: number;
  total_stock: number;
  created_at: string;
}

export interface ProductCreateInput {
  title: string;
  description?: string;
  category_id: number;
  variants: Array<{
    sku: string;
    size?: string;
    color?: string;
    price: number;
    stock_quantity: number;
  }>;
}
