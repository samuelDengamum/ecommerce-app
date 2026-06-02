import Link from 'next/link';
import { notFound } from 'next/navigation';

type InfoPage = {
  title: string;
  subtitle: string;
  description: string;
  points: string[];
};

type ContentSection = {
  heading: string;
  body: string;
};

const pages: Record<string, InfoPage> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'Fresh picks this week',
    description: 'Discover the latest products added to SuperStore across electronics, fashion, and lifestyle.',
    points: ['Updated every week', 'Curated by our team', 'Limited launch-time offers'],
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Customer favorites',
    description: 'Explore the most-loved products based on orders, ratings, and repeat purchases.',
    points: ['Top-rated items', 'Most reordered picks', 'Fast moving inventory'],
  },
  'sale-discounts': {
    title: 'Sale & Discounts',
    subtitle: 'Save more every day',
    description: 'Find active promotions, flash sales, and category-specific discounts in one place.',
    points: ['Weekly sales events', 'Bundle savings', 'Seasonal markdowns'],
  },
  'gift-cards': {
    title: 'Gift Cards',
    subtitle: 'Give great choices',
    description: 'Send digital gift cards instantly and let friends and family pick what they love.',
    points: ['Instant email delivery', 'Multiple denominations', 'Never expires'],
  },
  'about-us': {
    title: 'About Us',
    subtitle: 'Built for better shopping',
    description: 'SuperStore is focused on premium curation, smooth checkout, and reliable support.',
    points: ['Curated quality products', 'Secure purchase flow', 'Customer-first support'],
  },
  'blog-stories': {
    title: 'Blog & Stories',
    subtitle: 'Guides and product insights',
    description: 'Read buying guides, style tips, and behind-the-scenes stories from our team.',
    points: ['Trend roundups', 'Product care guides', 'Community stories'],
  },
  careers: {
    title: 'Careers',
    subtitle: 'Join the team',
    description: 'We are always looking for builders, designers, and operators who care about experience.',
    points: ['Remote-friendly roles', 'Growth-focused culture', 'Impactful product work'],
  },
  'press-media': {
    title: 'Press & Media',
    subtitle: 'Newsroom and resources',
    description: 'Access company announcements, media assets, and official contact information.',
    points: ['Brand resources', 'Press inquiries', 'Latest announcements'],
  },
  sustainability: {
    title: 'Sustainability',
    subtitle: 'Responsible growth',
    description: 'We continuously improve packaging, sourcing, and logistics to lower our footprint.',
    points: ['Lower-waste packaging', 'Conscious sourcing', 'Greener logistics'],
  },
  'help-center': {
    title: 'Help Center',
    subtitle: 'Answers in one place',
    description: 'Find quick help for ordering, payments, shipping, returns, and account settings.',
    points: ['Order tracking', 'Returns guidance', 'Account troubleshooting'],
  },
  'contact-us': {
    title: 'Contact Us',
    subtitle: 'We are here for you',
    description: 'Reach support for product, order, and account assistance through your preferred channel.',
    points: ['Email support', 'Fast response times', 'Friendly assistance'],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How we handle data',
    description: 'Your data is used responsibly to provide secure checkout and personalized experiences.',
    points: ['Secure data storage', 'Transparent usage', 'User data controls'],
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    subtitle: 'Service guidelines',
    description: 'Review the terms that govern account usage, purchases, and platform access.',
    points: ['Purchase terms', 'Account responsibilities', 'Usage guidelines'],
  },
  'shipping-info': {
    title: 'Shipping Info',
    subtitle: 'Delivery made easy',
    description: 'Learn about dispatch times, shipping methods, estimated delivery, and tracking options.',
    points: ['Fast standard shipping', 'Tracking updates', 'International options'],
  },
  accessibility: {
    title: 'Accessibility',
    subtitle: 'Inclusive for everyone',
    description: 'We are committed to accessibility and continuously improving usability across devices.',
    points: ['Keyboard-friendly controls', 'Readable color contrast', 'Continuous improvements'],
  },
  sitemap: {
    title: 'Sitemap',
    subtitle: 'Explore quickly',
    description: 'Use this quick map to navigate the core areas of SuperStore.',
    points: ['Home and products', 'Account pages', 'Support resources'],
  },
  'cookie-settings': {
    title: 'Cookie Settings',
    subtitle: 'Control your preferences',
    description: 'Manage cookie choices to balance personalization, performance, and privacy.',
    points: ['Essential cookies', 'Analytics preferences', 'Personalization controls'],
  },
};

const getPageSections = (slug: string, page: InfoPage): ContentSection[] => {
  if (['new-arrivals', 'best-sellers', 'sale-discounts', 'gift-cards'].includes(slug)) {
    return [
      {
        heading: 'What To Expect',
        body: `Our ${page.title.toLowerCase()} section is refreshed frequently with verified quality items, clear stock visibility, and transparent pricing.`,
      },
      {
        heading: 'How We Curate',
        body: 'Products are selected by relevance, reliability, and customer demand so you can shop faster with less guesswork.',
      },
      {
        heading: 'Smart Buying Tips',
        body: 'Use category filters, compare specs, and check stock labels to grab the best option before high-demand items run out.',
      },
    ];
  }

  if (['privacy-policy', 'terms-conditions', 'cookie-settings', 'accessibility'].includes(slug)) {
    return [
      {
        heading: 'Your Control',
        body: 'You can manage profile details, communication preferences, and consent choices directly from your account experience.',
      },
      {
        heading: 'Clear Standards',
        body: 'We keep our policies readable and practical so customers understand exactly how purchases, data, and platform usage are handled.',
      },
      {
        heading: 'Continuous Improvement',
        body: 'Legal and accessibility updates are reviewed regularly to keep SuperStore safe, inclusive, and up to date.',
      },
    ];
  }

  return [
    {
      heading: 'Why This Matters',
      body: page.description,
    },
    {
      heading: 'Service Promise',
      body: 'Every customer touchpoint is designed for speed, trust, and clarity across desktop and mobile experiences.',
    },
    {
      heading: 'Next Step',
      body: 'Browse products, explore resources, and use support links in the footer for quick access to anything you need.',
    },
  ];
};

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  if (slug === 'about-us') {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 py-20">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative container mx-auto px-6">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Who We Are</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Building A Faster, Smarter, And More Trusted Shopping Experience
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-slate-300">
              SuperStore is a product-first ecommerce platform designed to help people discover quality items faster,
              compare with confidence, and check out securely across every device.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-white">100+</p>
                <p className="mt-1 text-sm text-slate-300">Curated products</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="mt-1 text-sm text-slate-300">Support availability</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-white">Secure</p>
                <p className="mt-1 text-sm text-slate-300">Checkout architecture</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                We simplify online shopping by combining trusted product data, clear pricing, and a fast interface that
                feels effortless. Every screen is built to help customers move from discovery to delivery with less friction.
              </p>
              <ul className="mt-6 space-y-3 text-slate-200">
                <li className="rounded-xl border border-white/10 bg-slate-900/60 p-4">Clear product information with matched images and descriptions.</li>
                <li className="rounded-xl border border-white/10 bg-slate-900/60 p-4">Modern performance-first pages for smooth browsing and navigation.</li>
                <li className="rounded-xl border border-white/10 bg-slate-900/60 p-4">Reliable support resources and transparent customer policies.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold">What Makes SuperStore Different</h2>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-blue-300/20 bg-slate-900/60 p-5">
                  <p className="font-semibold text-white">Curated Catalog Quality</p>
                  <p className="mt-2 text-sm text-slate-300">Products are synchronized for accurate names, visuals, categories, and descriptions.</p>
                </div>
                <div className="rounded-2xl border border-blue-300/20 bg-slate-900/60 p-5">
                  <p className="font-semibold text-white">Convenient Pricing</p>
                  <p className="mt-2 text-sm text-slate-300">Pricing is tuned by category to stay realistic, competitive, and shopper-friendly.</p>
                </div>
                <div className="rounded-2xl border border-blue-300/20 bg-slate-900/60 p-5">
                  <p className="font-semibold text-white">Trust By Design</p>
                  <p className="mt-2 text-sm text-slate-300">Security, transparency, and accessibility are embedded in every customer flow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Our Values</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-base font-semibold text-white">Customer First</p>
                <p className="mt-2 text-sm text-slate-300">Every decision starts with customer clarity, speed, and confidence.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-base font-semibold text-white">Reliable Execution</p>
                <p className="mt-2 text-sm text-slate-300">From browsing to checkout, we optimize for consistency and uptime.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-base font-semibold text-white">Continuous Improvement</p>
                <p className="mt-2 text-sm text-slate-300">We iterate weekly to improve performance, UX, and service quality.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/products" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700">
                Explore Products
              </Link>
              <Link href="/info/contact-us" className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
                Contact Our Team
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
              ← Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (slug === 'contact-us') {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 py-16">
          <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative container mx-auto px-6">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Contact SuperStore</p>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">Let's Talk About Your Order Or Product Questions</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Reach our support team through email, phone, or live chat. You can also submit the contact form and we will respond quickly.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Email</p>
                <p className="mt-2 text-lg font-semibold text-white">support@superstore.com</p>
                <p className="mt-1 text-sm text-slate-300">For orders, returns, and account help.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Phone</p>
                <p className="mt-2 text-lg font-semibold text-white">+1 (800) 555-0199</p>
                <p className="mt-1 text-sm text-slate-300">Mon-Fri, 9:00 AM - 8:00 PM (EST)</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Office</p>
                <p className="mt-2 text-lg font-semibold text-white">SuperStore HQ</p>
                <p className="mt-1 text-sm text-slate-300">245 Commerce Avenue, New York, NY 10001</p>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 p-5">
                <p className="text-sm font-semibold text-white">Need immediate support?</p>
                <p className="mt-2 text-sm text-slate-200">Include your order ID in the message so we can solve your request faster.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <h2 className="text-2xl font-bold">Send Us A Message</h2>
              <p className="mt-2 text-sm text-slate-300">Fill out the form below and our team will get back to you as soon as possible.</p>

              <form className="mt-6 space-y-4" method="post" action="#" aria-label="Contact form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-200">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-200">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="orderId" className="mb-2 block text-sm font-medium text-slate-200">Order ID (optional)</label>
                    <input
                      id="orderId"
                      name="orderId"
                      type="text"
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="ORD-12345"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="mb-2 block text-sm font-medium text-slate-200">Topic</label>
                  <select
                    id="topic"
                    name="topic"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    defaultValue="order"
                  >
                    <option value="order">Order Support</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="product">Product Question</option>
                    <option value="account">Account Help</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-200">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
              ← Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // For some info pages, include example products
  let sampleProducts = null;
  const sections = getPageSections(slug, page);

  if ([
    'new-arrivals',
    'best-sellers',
    'sale-discounts',
  ].includes(slug)) {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        sampleProducts = data.slice(0, 6);
      }
    } catch (err) {
      // ignore fetch errors and render page copy
      sampleProducts = null;
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16">
        <div className="container mx-auto px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">SuperStore Info</p>
          <h1 className="mb-3 text-4xl font-black md:text-5xl">{page.title}</h1>
          <p className="text-lg text-slate-300">{page.subtitle}</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="mb-8 max-w-3xl text-slate-200">{page.description}</p>

          <div className="grid gap-4 md:grid-cols-3">
            {page.points.map((point) => (
              <div key={point} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-200">
                {point}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {sections.map((section) => (
              <div key={section.heading} className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-5">
                <h3 className="mb-2 text-base font-semibold text-white">{section.heading}</h3>
                <p className="text-sm leading-relaxed text-slate-200">{section.body}</p>
              </div>
            ))}
          </div>

          {sampleProducts && sampleProducts.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-bold">Featured for {page.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProducts.map((p: any) => (
                  <Link key={p._id} href={`/products/${p._id}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:shadow-2xl backdrop-blur">
                    <div className="h-40 w-full overflow-hidden rounded-lg mb-3 bg-slate-900/70">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain object-center" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-sm text-slate-300">${p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {slug === 'sitemap' && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                Home
              </Link>
              <Link href="/products" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                Products
              </Link>
              <Link href="/cart" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                Cart
              </Link>
              <Link href="/login" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                Login
              </Link>
              <Link href="/register" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                Register
              </Link>
              <Link href="/info/help-center" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                Help Center
              </Link>
            </div>
          )}

          <div className="mt-10">
            <Link href="/" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
