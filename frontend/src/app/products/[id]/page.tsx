import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductPurchasePanel from '../../components/ProductPurchasePanel';

export const revalidate = 300;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  category: string;
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

async function fetchRelatedProducts(id: string): Promise<Product[]> {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/products/related/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Product[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    return [];
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(id);

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
            {product.image ? (
              <img
                src={product.image}
                alt={product.name || 'product'}
                className="h-full min-h-[420px] w-full object-contain object-center"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-9xl text-slate-300">
                {product.name?.charAt(0) || 'P'}
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

            <ProductPurchasePanel product={product} />
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
                          className="h-full w-full object-contain object-center transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                          decoding="async"
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
