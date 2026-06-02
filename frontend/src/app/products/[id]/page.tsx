'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  category: string;
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/products/related/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load related products');
        const data = await response.json();
        if (Array.isArray(data)) {
          setRelatedProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch related products:', err);
        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-300">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-300 mb-4">Product not found</p>
        <Link href="/products" className="text-blue-400 hover:text-blue-300">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <Link href="/products" className="text-blue-400 hover:text-blue-300">
            ← Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur">
            {product?.image ? (
              <img
                src={product.image}
                alt={product.name || 'product'}
                className="h-full min-h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-9xl text-slate-300">
                {product?.name?.charAt(0) || 'P'}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
                {product.category}
              </p>
              <h1 className="mb-4 text-4xl font-bold text-white">{product.name}</h1>
              <div className="mb-6">
                <p className="mb-2 text-5xl font-bold text-white">${product.price}</p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    product.stock > 0
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-rose-500/15 text-rose-300'
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              <p className="mb-8 text-lg leading-relaxed text-slate-300">
                {product.description}
              </p>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="font-semibold text-white">{product.category}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Stock Available</p>
                  <p className="font-semibold text-white">{product.stock} units</p>
                </div>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-slate-300">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-lg border-2 border-blue-600 bg-transparent py-4 text-lg font-bold text-blue-400 transition-all duration-300 hover:bg-blue-600/10"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Buy Now
                  </button>
                </div>
                {added && <p className="text-sm text-emerald-300">Added to cart successfully.</p>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-12">
          <h2 className="mb-8 text-2xl font-bold text-white">You Might Also Like</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._id} href={`/products/${relatedProduct._id}`}>
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-blue-400 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20">
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                      {relatedProduct.image ? (
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-slate-400">
                          {relatedProduct.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-semibold text-white line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-400">${relatedProduct.price}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          relatedProduct.stock > 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {relatedProduct.stock > 0 ? 'In Stock' : 'Out'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
              <p className="text-slate-300">No related products found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
