'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SupportAdmin from './components/SupportAdmin';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(storedToken || '');
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const meRes = await fetch('http://127.0.0.1:5000/api/auth/me', {
          headers: { 'x-auth-token': token },
        });

        if (!meRes.ok) {
          setLoading(false);
          return;
        }

        const me = await meRes.json();
        setIsAdmin(me.role === 'admin');

        if (me.role !== 'admin') {
          setLoading(false);
          return;
        }

        const userRes = await fetch('http://127.0.0.1:5000/api/users', {
          headers: { 'x-auth-token': token },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData);
        }

        const productRes = await fetch('http://127.0.0.1:5000/api/products');
        const productData = await productRes.json();
        setProducts(productData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-white/80">Manage your store with role-based control</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-6 py-12">
        {!token ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <p className="mb-4 text-slate-300">Please sign in as admin to view this page</p>
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <p className="text-slate-300">Loading dashboard...</p>
          </div>
        ) : !isAdmin ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <p className="text-slate-300">You do not have permission to access this page.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-300 text-sm font-medium">Total Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{users.length}</p>
                  </div>
                  <div className="text-5xl opacity-10">👥</div>
                </div>
                <p className="text-sm text-slate-400">Active users in system</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-300 text-sm font-medium">Total Products</p>
                    <p className="text-4xl font-bold text-white mt-2">{products.length}</p>
                  </div>
                  <div className="text-5xl opacity-10">📦</div>
                </div>
                <p className="text-sm text-slate-400">Products in catalog</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-300 text-sm font-medium">Total Revenue</p>
                    <p className="text-4xl font-bold text-white mt-2">$0</p>
                  </div>
                  <div className="text-5xl opacity-10">💰</div>
                </div>
                <p className="text-sm text-slate-400">Coming soon</p>
              </div>
            </div>

            {/* Live Support Admin Panel */}
            <SupportAdmin />

            {/* Users Table */}
            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm overflow-hidden mb-8 mt-8 backdrop-blur">
              <div className="px-8 py-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Recent Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-white">Name</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-white">Email</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-white">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-8 py-4 text-sm text-white">{user.name}</td>
                        <td className="px-8 py-4 text-sm text-slate-300">{user.email}</td>
                        <td className="px-8 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-fuchsia-500/15 text-fuchsia-300'
                              : 'bg-white/10 text-slate-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm overflow-hidden backdrop-blur">
              <div className="px-8 py-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-white">Product Name</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-white">Price</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-white">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-8 py-4 text-sm text-white">{product.name}</td>
                        <td className="px-8 py-4 text-sm font-semibold text-white">${product.price}</td>
                        <td className="px-8 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 0
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
