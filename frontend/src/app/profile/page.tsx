/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type UserShape = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const ProfilePage = () => {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [user, setUser] = useState<UserShape | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');

  const initials = useMemo(() => {
    if (!user?.name) return 'U';
    const words = user.name.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }, [user]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || '';
    setToken(storedToken);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    const loadMe = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'x-auth-token': storedToken },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        const normalizedUser = {
          id: data._id || data.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'user',
        };

        setUser(normalizedUser);
        setName(normalizedUser.name);
        setEmail(normalizedUser.email);
      } catch {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setProfileMessage('');

    if (!token) {
      setError('Please sign in to update your profile.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Unable to update profile.');
        return;
      }

      const updatedUser = data.user as UserShape;
      const nextToken = data.token || token;

      localStorage.setItem('token', nextToken);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('authchange'));

      setToken(nextToken);
      setUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setProfileMessage('Profile updated successfully.');
    } catch {
      setError('Something went wrong while updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setPasswordMessage('');

    if (!token) {
      setError('Please sign in to change password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'Unable to change password.');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Password updated successfully.');
    } catch {
      setError('Something went wrong while changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!token && !loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-black">Sign in required</h1>
            <p className="mt-3 text-slate-300">You need to sign in before accessing your profile.</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700"
            >
              Go to Sign In
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 py-14">
        <div className="container mx-auto px-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Account</p>
          <h1 className="text-4xl font-black">My Profile</h1>
          <p className="mt-3 text-slate-300">Manage your personal details and account security.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">Loading profile...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{user?.name || 'User'}</p>
                  <p className="text-sm text-slate-300">{user?.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-slate-400">Role</p>
                  <p className="font-semibold text-white capitalize">{user?.role || 'user'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-slate-400">Quick Links</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link href="/cart" className="rounded-lg bg-white/5 px-3 py-1 text-slate-200 hover:bg-white/10">Cart</Link>
                    <Link href="/products" className="rounded-lg bg-white/5 px-3 py-1 text-slate-200 hover:bg-white/10">Products</Link>
                    <Link href="/info/help-center" className="rounded-lg bg-white/5 px-3 py-1 text-slate-200 hover:bg-white/10">Help</Link>
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <p className="mt-2 text-sm text-slate-300">Update your account name and email address.</p>

                <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>

                {profileMessage && <p className="mt-4 text-sm text-emerald-300">{profileMessage}</p>}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold">Password & Security</h2>
                <p className="mt-2 text-sm text-slate-300">Change your password to keep your account secure.</p>

                <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-slate-200">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-slate-200">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-200">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                  >
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                {passwordMessage && <p className="mt-4 text-sm text-emerald-300">{passwordMessage}</p>}
              </div>

              {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
