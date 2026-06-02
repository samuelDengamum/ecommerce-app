/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCartCount } from '@/lib/cart';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const profileRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const initials = useMemo(() => {
    if (!userName) return 'U';
    const words = userName.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }, [userName]);

  const syncAuthState = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(Boolean(token));

    if (!user) {
      setRole('');
      setUserName('');
      setUserEmail('');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setRole(parsedUser.role || '');
      setUserName(parsedUser.name || 'User');
      setUserEmail(parsedUser.email || '');
    } catch {
      setRole('');
      setUserName('');
      setUserEmail('');
    }
  };

  useEffect(() => {
    syncAuthState();
  }, []);

  useEffect(() => {
    router.prefetch('/products');
    router.prefetch('/cart');
    router.prefetch('/login');
    router.prefetch('/register');
    router.prefetch('/profile');
    router.prefetch('/admin');
    router.prefetch('/info/help-center');
    router.prefetch('/info/contact-us');
    router.prefetch('/info/shipping-info');
  }, [router]);

  useEffect(() => {
    const handleAuthChange = () => syncAuthState();
    
    window.addEventListener('authchange', handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('authchange', handleAuthChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());
    syncCart();

    window.addEventListener('cartchange', syncCart as EventListener);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('cartchange', syncCart as EventListener);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentSearch = new URLSearchParams(window.location.search).get('search') || '';
      setSearchTerm(currentSearch);
    }
  }, [pathname]);

  useEffect(() => {
    setProfileOpen(false);
    setNavigatingTo(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  useEffect(() => {
    // Read current lang from googtrans cookie on mount
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
      if (match && match[1]) {
        const map: Record<string, string> = { 'ar': 'عربي', 'fr': 'Français', 'es': 'Español' };
        setCurrentLang(map[match[1]] || 'English');
      }
    }
  }, []);

  const changeLanguage = (langCode: string, label: string) => {
    if (langCode === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
    }
    setCurrentLang(label);
    setLangMenuOpen(false);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setRole('');
    setUserName('');
    setUserEmail('');
    setProfileOpen(false);
    window.dispatchEvent(new Event('authchange'));
    router.replace('/');
  };

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('productSearchTerm');
        window.dispatchEvent(new Event('productsearch'));
      }
      router.push('/products');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/products');
      if (response.ok) {
        const products = await response.json();
        const q = trimmed.toLowerCase();
        // find if any product matches the search to direct to the product page directly
        const targetProduct = products.find((p: { name: string; category: string; description?: string; _id: string }) => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );

        if (targetProduct) {
          router.push(`/products/${targetProduct._id}`);
          return;
        }
      }
    } catch (err) {
      console.error('Search fetch failed', err);
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('productSearchTerm', trimmed);
      window.dispatchEvent(new Event('productsearch'));
    }

    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const handleNavigate = (path: string) => {
    setNavigatingTo(path);
    router.push(path);
  };

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes navItemHover {
          0% {
            color: rgb(203, 213, 225);
          }
          100% {
            color: rgb(255, 255, 255);
          }
        }
        
        .nav-item {
          animation: navSlideDown 0.5s ease-out forwards;
        }
        
        .nav-item:nth-child(2) { animation-delay: 0.1s; opacity: 0; }
        .nav-item:nth-child(3) { animation-delay: 0.15s; opacity: 0; }
        .nav-item:nth-child(4) { animation-delay: 0.2s; opacity: 0; }
        .nav-item:nth-child(5) { animation-delay: 0.25s; opacity: 0; }
        
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .icon-btn:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          transform: scale(1.1);
        }

        .profile-panel {
          animation: navSlideDown 0.2s ease-out forwards;
        }
      `}</style>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="nav-item flex items-center gap-2 text-xl font-black tracking-tight text-white transition-all hover:scale-105"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">✦</span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">Nexis</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative nav-item">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 py-1.5 px-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="tracking-wide">{currentLang}</span>
                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl z-[60]">
                  <button onClick={() => changeLanguage('en', 'English')} className="block w-full py-2.5 px-4 text-left text-sm font-medium text-slate-300 hover:bg-blue-500/10 hover:text-white transition-colors">English</button>
                  <button onClick={() => changeLanguage('ar', 'عربي')} className="block w-full py-2.5 px-4 text-left text-sm font-medium text-slate-300 hover:bg-blue-500/10 hover:text-white transition-colors">عربي (Arabic)</button>
                  <button onClick={() => changeLanguage('fr', 'Français')} className="block w-full py-2.5 px-4 text-left text-sm font-medium text-slate-300 hover:bg-blue-500/10 hover:text-white transition-colors">Français</button>
                  <button onClick={() => changeLanguage('es', 'Español')} className="block w-full py-2.5 px-4 text-left text-sm font-medium text-slate-300 hover:bg-blue-500/10 hover:text-white transition-colors">Español</button>
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button className="icon-btn" onClick={() => setSearchOpen((prev) => !prev)} aria-label="Toggle search">
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => handleNavigate(isLoggedIn ? '/cart' : '/login')}
              disabled={navigatingTo === '/cart' || navigatingTo === '/login'}
              className="icon-btn relative" 
              aria-label="Open cart"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isLoggedIn && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <Link href="/info/help-center" className="hidden sm:flex px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 rounded-lg border border-white/10 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white">
              Help
            </Link>

            {/* Auth Links */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavigate('/login')}
                  disabled={navigatingTo === '/login'}
                  className="nav-item hidden sm:flex relative group px-6 py-2 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-75"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md"></span>
                  <span className="absolute inset-0 w-full h-full border border-white/10 rounded-full group-hover:border-blue-400/50 group-hover:bg-blue-500/10 transition-colors duration-300"></span>
                  <span className="relative flex items-center gap-2 text-slate-200 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all">
                    {navigatingTo === '/login' ? (
                      <span key="loading" className="flex items-center gap-2">
                         <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v0c4.418 0 8 3.582 8 8z"></path></svg>
                         <span>Loading...</span>
                      </span>
                    ) : (
                      <span key="ready" className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign In</span>
                      </span>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => handleNavigate('/register')}
                  disabled={navigatingTo === '/register'}
                  className="nav-item bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-75"
                >
                  {navigatingTo === '/register' ? (
                    <span key="loading" className="flex items-center gap-2">
                       <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v0c4.418 0 8 3.582 8 8z"></path></svg>
                       <span>Loading...</span>
                    </span>
                  ) : (
                    <span key="ready">Get Started</span>
                  )}
                </button>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 pr-3 transition hover:border-blue-400/50 hover:bg-blue-500/10"
                  aria-label="Open user menu"
                >
                  <span translate="no" className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                    {initials}
                  </span>
                  <span className="hidden text-sm font-semibold text-slate-200 sm:block">{userName || 'Account'}</span>
                </button>

                {profileOpen && (
                  <div className="profile-panel absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-2xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-sm font-semibold text-white">{userName || 'Signed In User'}</p>
                      {userEmail && <p className="mt-1 text-xs text-slate-400">{userEmail}</p>}
                    </div>

                    <div className="p-2 text-sm">
                      <Link href="/profile" className="block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
                        My Profile
                      </Link>
                      <Link href="/cart" className="block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
                        My Cart
                      </Link>
                      <Link href="/info/shipping-info" className="block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
                        Track Orders
                      </Link>
                      <Link href="/info/help-center" className="block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
                        Help Center
                      </Link>
                      <Link href="/info/contact-us" className="block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
                        Contact Support
                      </Link>
                      {role === 'admin' && (
                        <Link href="/admin" className="block rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Search layout */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-900/95 backdrop-blur-3xl border-white/5 ${
            searchOpen ? 'max-h-24 py-4 opacity-100 border-b' : 'max-h-0 py-0 opacity-0 border-transparent border-b-0'
          }`}
        >
          <form onSubmit={handleSearchSubmit} className="container mx-auto flex flex-row items-center justify-center gap-3 px-6 h-full">
            <div className="relative w-full max-w-4xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for premium products, electronics, accessories..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner transition-all hover:bg-white/10"
                autoFocus={true}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 flex items-center gap-2"
            >
              Search
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
