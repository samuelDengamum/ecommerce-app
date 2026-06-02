'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/cart';

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
};

type Props = {
  product: Product;
};

export default function ProductPurchasePanel({ product }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Please sign in to add items to your cart.');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

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
    setErrorMsg('');
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Please sign in to proceed with purchase.');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

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

    // Optionally set a flag to immediately open checkout on the Cart page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('autoCheckout', 'true');
    }
    router.push('/cart');
  };

  if (product.stock <= 0) {
    return null;
  }

  return (
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
      <button
        onClick={handleAddToCart}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
      >
        Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        className="w-full rounded-lg border-2 border-emerald-500 bg-emerald-500/10 py-4 text-lg font-bold text-emerald-400 transition-all duration-300 hover:bg-emerald-500 hover:text-white"
      >
        Buy Now
      </button>

      {added && <p className="text-sm text-emerald-300">Added to cart successfully.</p>}
      {errorMsg && <p className="text-sm text-rose-300">{errorMsg}</p>}
    </div>
  );
}
