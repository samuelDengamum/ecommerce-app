'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import ProductImage from '../components/ProductImage';
import type { Product } from './products-data';

type Props = {
  products: Product[];
};

export default function ProductsCatalogClient({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const syncSearch = () => {
      const stored = sessionStorage.getItem('productSearchTerm');
      if (stored !== null) {
        setSearchTerm(stored);
      } else {
        const query = new URLSearchParams(window.location.search).get('search');
        if (query) setSearchTerm(query);
      }
    };
    
    syncSearch();

    window.addEventListener('productsearch', syncSearch);
    return () => window.removeEventListener('productsearch', syncSearch);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (deferredSearchTerm) {
      const q = deferredSearchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.description || '').toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [selectedCategory, deferredSearchTerm, products]);

  const categories = useMemo(
    () => ['all', ...new Set(products.map((product) => product.category))],
    [products]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-r from-indigo-700 via-slate-900 to-slate-950 text-white py-14 border-b border-white/10">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-slate-300">Browse our complete collection</p>
        </div>
      </div>

      <div className="border-b border-white/10 bg-white/5 py-8 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-white/10 rounded-lg bg-slate-900/80 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-white/10 rounded-lg bg-slate-900/80 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-300">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-2xl backdrop-blur">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 h-48 w-full overflow-hidden relative">
                    <div className="h-full w-full">
                      <ProductImage src={product.image} alt={product.name} />
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-300 mb-4 flex-grow">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-lg font-bold text-white">${product.price}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          product.stock > 0
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-rose-500/15 text-rose-300'
                        }`}
                      >
                        {product.stock > 0 ? 'In Stock' : 'Out'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
