export interface Product {
  id: number;
  name: string;
  description: string;
  stage: string;
  image?: string | null;
  is_new: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  size: string;
  price: number;
  stock: number;
  image?: string | null;
}

export interface Categories {
  id: number;
  name: string;
}
