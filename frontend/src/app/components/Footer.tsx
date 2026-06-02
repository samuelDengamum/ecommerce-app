'use client';

import Link from 'next/link';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shopLinks = [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/info/new-arrivals' },
    { label: 'Best Sellers', href: '/info/best-sellers' },
    { label: 'Sale & Discounts', href: '/info/sale-discounts' },
    { label: 'Gift Cards', href: '/info/gift-cards' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '/info/about-us' },
    { label: 'Blog & Stories', href: '/info/blog-stories' },
    { label: 'Careers', href: '/info/careers' },
    { label: 'Press & Media', href: '/info/press-media' },
    { label: 'Sustainability', href: '/info/sustainability' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '/info/help-center' },
    { label: 'Contact Us', href: '/info/contact-us' },
    { label: 'Privacy Policy', href: '/info/privacy-policy' },
    { label: 'Terms & Conditions', href: '/info/terms-conditions' },
    { label: 'Shipping Info', href: '/info/shipping-info' },
  ];

  const legalLinks = [
    { label: 'Accessibility', href: '/info/accessibility' },
    { label: 'Sitemap', href: '/info/sitemap' },
    { label: 'Cookie Settings', href: '/info/cookie-settings' },
  ];

  const socialLinks = [
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'X', href: 'https://x.com', icon: 'x' },
    { label: 'GitHub', href: 'https://github.com', icon: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      <style>{`
        @keyframes footerSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .footer-section {
          animation: footerSlideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .footer-section:nth-child(1) { animation-delay: 0.1s; }
        .footer-section:nth-child(2) { animation-delay: 0.2s; }
        .footer-section:nth-child(3) { animation-delay: 0.3s; }
        .footer-section:nth-child(4) { animation-delay: 0.4s; }

        .footer-link {
          position: relative;
          transition: all 0.3s ease;
        }

        .footer-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          transition: width 0.3s ease;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .footer-link:hover {
          color: #60a5fa;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          animation: float 3s ease-in-out infinite;
        }

        .social-icon:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
          transform: scale(1.15) translateY(-4px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 8px;
          color: white;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .newsletter-input:focus {
          outline: none;
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .newsletter-btn {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }

        .newsletter-btn:active {
          transform: translateY(0);
        }

        .success-message {
          color: #10b981;
          font-size: 14px;
          animation: slideInUp 0.3s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <footer className="bg-gradient-to-b from-slate-900/50 to-slate-950 text-white mt-20 py-20 border-t border-white/10">
        <div className="container mx-auto px-6 relative">
          {/* Newsletter Section */}
          <div className="mb-16 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-white/10 p-8 backdrop-blur-xl">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-slate-400 mb-6">
                Get exclusive deals, new arrivals, and insider tips delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input flex-1"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <div className="success-message mt-4">
                  ✓ Thanks for subscribing! Check your inbox soon.
                </div>
              )}
            </div>
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Section */}
            <div className="footer-section">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">✦</span>
                </div>
                <h3 className="text-lg font-bold">Nexis</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your ultimate destination for premium shopping. Discover curated products, fast shipping, and exceptional service.
              </p>
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="social-icon"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon === 'facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {social.icon === 'x' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.901 1.153h3.68l-8.04 9.188 9.458 12.506H16.594l-5.8-7.584-6.64 7.584H.472l8.6-9.826L0 1.154h7.594l5.243 6.932 6.064-6.933z" />
                      </svg>
                    )}
                    {social.icon === 'github' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.545 2.914 1.209.1-.946.35-1.591.636-1.956-2.22-.2-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.270.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.739-4.565 4.991.359.307.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C19.138 20.195 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    )}
                    {social.icon === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.413h-3v-9.82h3v9.82zM9.5 5.316c-.966 0-1.75.784-1.75 1.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75-.784-1.75-1.75-1.75zM20 16.413h-3v-4.793c0-1.142-.413-1.92-1.43-1.92-1.05 0-1.675.707-1.95 1.39-.1.243-.126.582-.126.922v4.401h-3s.04-7.15 0-7.879h3v1.116l-.017.026h.017v-.026c.348-.537.97-1.304 2.359-1.304 1.72 0 3.01 1.122 3.01 3.537v4.53z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Column */}
            <div className="footer-section">
              <h4 className="font-semibold mb-6 text-lg">Shop</h4>
              <ul className="text-slate-400 text-sm space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link hover:text-slate-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="footer-section">
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="text-slate-400 text-sm space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link hover:text-slate-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div className="footer-section">
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="text-slate-400 text-sm space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link hover:text-slate-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>&copy; 2026 Nexis. All rights reserved. Made with ✨ for great shopping.</p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link hover:text-slate-200 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Floating Gradient Blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
