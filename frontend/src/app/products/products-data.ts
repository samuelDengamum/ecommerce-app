export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock: number;
}

export async function fetchProductsForCatalog(): Promise<Product[]> {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/products', {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = (await response.json()) as Product[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}
