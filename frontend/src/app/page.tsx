import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const revalidate = 300;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = (await response.json()) as Product[];
    return Array.isArray(data) ? data.slice(0, 8) : [];
  } catch (error) {
    console.error('Failed to load featured products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
        .animate-slideInDown { animation: slideInDown 0.8s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-scroll { animation: scroll 30s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
        .shimmer-gradient {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:60px_60px]"></div>

        <div className="relative container mx-auto px-6 py-20 md:py-32 z-10">
          <div className="flex justify-center mb-8 animate-slideInDown">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-semibold text-blue-300">Welcome to Nexis</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter animate-slideInUp text-center leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-indigo-400">
              Shopping Evolved
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto text-center animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            Explore 100+ premium curated products with lightning-fast delivery, secure payments, and 24/7 support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <Link href="/products" className="group relative overflow-hidden px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                🛍️ Start Shopping
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link href="/products" className="px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:border-white/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
              Explore Catalog
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="text-3xl font-bold text-blue-400 mb-1">100+</div>
              <div className="text-sm text-slate-400">Premium Products</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="text-3xl font-bold text-emerald-400 mb-1">⚡ Fast</div>
              <div className="text-sm text-slate-400">Free Shipping $50+</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="text-3xl font-bold text-indigo-400 mb-1">🛡️ Safe</div>
              <div className="text-sm text-slate-400">Secure Checkout</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 py-24 relative">
        {/* Subtle background glow for a powerful modern look */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="text-center mb-24 animate-slideInUp">
          <div className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <span className="text-2xl animate-bounce">🔥</span>
            <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-[0.3em] uppercase">Trending Now</p>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl">
            Best Selling <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 animate-gradient-x">Products</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Handpicked selections loved by thousands of customers worldwide. Unleash the power of premium quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <Link key={product._id} href={`/products/${product._id}`} className="group">
              <div className="h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 shadow-sm transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-xl relative animate-slideInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-gradient"></div>

                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-6xl font-bold text-slate-600">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.category}
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-300 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mb-5 text-sm text-slate-400 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-white">${product.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.stock > 0 ? (
                        <>
                          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs font-bold text-emerald-300">In Stock</span>
                        </>
                      ) : (
                        <>
                          <span className="w-3 h-3 rounded-full bg-red-500"></span>
                          <span className="text-xs font-bold text-red-300">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 rounded-xl text-center text-sm">
                      View Details →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 animate-slideInUp">
          <Link href="/products" className="group inline-flex items-center gap-3 border-2 border-white/30 text-white font-bold py-4 px-10 rounded-2xl hover:border-white/60 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <span>Browse All Products</span>
            <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative border-t border-white/10 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:60px_60px]"></div>
        
        {/* Glow effects matching main theme */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>

        <div className="w-full py-16 relative z-10">
          <div className="text-center mb-16 animate-slideInUp px-6">
            <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <span className="text-2xl animate-pulse">✨</span>
              <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-[0.3em] uppercase">Trusted Globally</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Community</span> Says
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              Join thousands of satisfied shoppers who have revolutionized their shopping experience with Nexis.
            </p>
          </div>

          <div className="relative flex overflow-x-hidden w-full group mask-image-fade" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex gap-10 px-8 pt-8 pb-10 animate-scroll w-max hover:[animation-play-state:paused]">
              {/* We render the cards twice to create a seamless infinite loop */}
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-10">
                  {/* Testimonial Card 1 */}
                  <div className="w-[350px] md:w-[400px] p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group/card shadow-xl hover:shadow-blue-500/20 flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-lg shadow-blue-500/30">&quot;</div>
                    <div className="flex gap-1 mb-6 text-yellow-500 pt-2">
                      {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-lg">{star}</span>)}
                    </div>
                    <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed flex-grow">
                      &quot;The shopping experience was incredibly smooth. Fast shipping and the product quality exceeded my expectations. Will definitely buy again!&quot;
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-1">
                        <div translate="no" className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-blue-400 font-bold text-xl">SJ</div>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Sarah Jenkins</div>
                        <div className="text-sm text-blue-400 font-medium">Verified Buyer</div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Card 2 */}
                  <div className="w-[350px] md:w-[400px] p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group/card shadow-xl hover:shadow-indigo-500/20 flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-lg shadow-indigo-500/30">&quot;</div>
                    <div className="flex gap-1 mb-6 text-yellow-500 pt-2">
                      {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-lg">{star}</span>)}
                    </div>
                    <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed flex-grow">
                      &quot;Finding what I needed was a breeze. The UI is drop-dead gorgeous and checkout was blazing fast. 10/10 recommend.&quot;
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                        <div translate="no" className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 font-bold text-xl">MC</div>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Marcus Chen</div>
                        <div className="text-sm text-indigo-400 font-medium">Tech Enthusiast</div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Card 3 */}
                  <div className="w-[350px] md:w-[400px] p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group/card shadow-xl hover:shadow-blue-400/20 flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 shrink-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-lg shadow-blue-400/30">&quot;</div>
                    <div className="flex gap-1 mb-6 text-yellow-500 pt-2">
                      {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-lg">{star}</span>)}
                    </div>
                    <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed flex-grow">
                      &quot;Outstanding customer service. I had a question about my order and they responded within minutes. Quality products and trustworthy team.&quot;
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 p-1">
                        <div translate="no" className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-blue-400 font-bold text-xl">ER</div>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Elena Rodriguez</div>
                        <div className="text-sm text-blue-300 font-medium">Regular Customer</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial Card 4 */}
                  <div className="w-[350px] md:w-[400px] p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group/card shadow-xl hover:shadow-slate-400/20 flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 shrink-0 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-lg shadow-slate-500/30">&quot;</div>
                    <div className="flex gap-1 mb-6 text-yellow-500 pt-2">
                      {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-lg">{star}</span>)}
                    </div>
                    <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed flex-grow">
                      &quot;The attention to detail and packaging is unmatched. Nexis has completely changed how I shop online. Brilliant!&quot;
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 p-1">
                        <div translate="no" className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-slate-300 font-bold text-xl">DK</div>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">David Kim</div>
                        <div className="text-sm text-slate-400 font-medium">Design Director</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
