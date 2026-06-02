'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductImage from '@/app/components/ProductImage';
import { CartItem, clearCart, removeCartItem, updateCartItemQuantity, getCart } from '@/lib/cart';

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const refreshCart = () => {
    setItems(getCart());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart();

    // Check if we need to auto-trigger checkout (from Buy Now button)
    const autoCheckout = sessionStorage.getItem('autoCheckout');
    if (autoCheckout === 'true') {
      setIsCheckout(true);
      sessionStorage.removeItem('autoCheckout');
    }

    window.addEventListener('cartchange', refreshCart as EventListener);
    window.addEventListener('storage', refreshCart);

    return () => {
      window.removeEventListener('cartchange', refreshCart as EventListener);
      window.removeEventListener('storage', refreshCart);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = subtotal > 50 || items.length === 0 ? 0 : 6.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setIsCheckout(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-slate-950 text-white py-24 flex items-center justify-center">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-12 text-center backdrop-blur-xl max-w-lg">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-emerald-200 mb-8">Thank you for your order. We&apos;ve sent a confirmation email with your order details.</p>
          <Link href="/products" className="inline-flex rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-500 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-14">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-black">Your Cart</h1>
          <p className="mt-2 text-slate-300">Review your items and continue to checkout.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <p className="mb-4 text-lg text-slate-300">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-flex rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-slate-900/80 relative flex-shrink-0">
                      {item.image ? (
                        <ProductImage src={item.image} alt={item.name} className="object-contain object-center bg-white/5" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-300">${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="text-xs text-rose-300 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-fit">
              <h2 className="mb-5 text-xl font-bold">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {!isCheckout ? (
                <>
                  <button 
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-transform"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => clearCart()}
                    className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    Clear Cart
                  </button>
                </>
              ) : (
                <form onSubmit={handlePayment} className="space-y-4 animate-slideInUp">
                  <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Select Payment Method</h3>
                  
                  <div className="space-y-3">
                    {/* Mobile Money (MoMo) */}
                    <label className={`block flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <input required type="radio" name="payment" value="momo" onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <div className="w-10 h-6 bg-yellow-400 rounded block flex items-center justify-center font-bold text-[10px] text-black" translate="no"><span className="notranslate">MoMo</span></div>
                      <span className="font-medium text-sm">MTN Mobile Money</span>
                    </label>

                    {/* Airtel Money */}
                    <label className={`block flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'airtel' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <input required type="radio" name="payment" value="airtel" onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <div className="w-10 h-6 bg-red-600 rounded block flex items-center justify-center font-bold text-[10px] text-white" translate="no"><span className="notranslate">airtel</span></div>
                      <span className="font-medium text-sm">Airtel Money</span>
                    </label>

                    {/* PayPal */}
                    <label className={`block flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <input required type="radio" name="payment" value="paypal" onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <div className="w-10 h-6 bg-white rounded block flex items-center justify-center font-bold italic text-blue-800 text-[10px]" translate="no"><span className="notranslate">PayPal</span></div>
                      <span className="font-medium text-sm">PayPal</span>
                    </label>

                    {/* Visa */}
                    <label className={`block flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'visa' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <input required type="radio" name="payment" value="visa" onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <div className="w-10 h-6 bg-white rounded block flex items-center justify-center font-bold italic text-blue-700 text-[11px]" translate="no"><span className="notranslate">VISA</span></div>
                      <span className="font-medium text-sm">Visa</span>
                    </label>

                    {/* Mastercard */}
                    <label className={`block flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'mastercard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <input required type="radio" name="payment" value="mastercard" onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <div className="w-10 h-6 bg-slate-200 rounded block flex gap-1 items-center justify-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mix-blend-multiply opacity-80 -mr-2 z-10"></div>
                        <div className="w-4 h-4 bg-orange-400 rounded-full mix-blend-multiply opacity-80"></div>
                      </div>
                      <span className="font-medium text-sm">Mastercard</span>
                    </label>
                  </div>

                  {paymentMethod === 'momo' || paymentMethod === 'airtel' ? (
                    <div className="pt-2">
                      <input type="text" required placeholder="Enter Mobile Number" className="w-full bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  ) : paymentMethod === 'paypal' ? (
                    <div className="pt-2">
                      <input type="email" required placeholder="Enter PayPal Email or Username" className="w-full bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  ) : paymentMethod === 'visa' || paymentMethod === 'mastercard' ? (
                    <div className="pt-2 space-y-2 text-sm">
                      <input type="text" required placeholder="Card Number" className="w-full bg-slate-900 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <div className="flex gap-2">
                        <input type="text" required placeholder="MM/YY" className="w-1/2 bg-slate-900 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input type="text" required placeholder="CVC" className="w-1/2 bg-slate-900 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsCheckout(false)}
                      className="w-1/3 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isProcessing || !paymentMethod}
                      className="w-2/3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v0c4.418 0 8 3.582 8 8z"></path></svg> Processing...</>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default CartPage;
