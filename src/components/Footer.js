import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocationStore } from '../store/locationStore';

const footerLinks = {
  Explore: [
    { to: '/menu', label: 'Our Menu' },
    { to: '/booking', label: 'Make a Reservation' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/blogs', label: 'Blog & Stories' },
    { to: '/testimonials', label: 'Guest Reviews' },
  ],
  About: [
    { to: '/about', label: 'Our Story' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/reservations', label: 'My Reservations' },
    { to: '/scanner', label: 'QR Scanner' },
  ],
};

const socialLinks = [
  {
    name: 'Instagram',
    href: '#!',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#!',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: '#!',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
  },
];

export default function Footer() {
  const { selectedLocation } = useLocationStore();
  const loc = selectedLocation || {
    city: 'Paris',
    address: '42 Rue de Rivoli, 75001 Paris, France',
    phone: '+33 1 42 60 82 00',
    hours: { weekday: '18:00 – 23:00', weekend: '12:00 – 23:30' },
  };

  return (
    <footer role="contentinfo" className="relative bg-charcoal text-white/60 overflow-hidden">
      {/* Decorative top gradient border */}
      <div className="h-px w-full gold-gradient opacity-40" />

      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A96E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C9A96E 0%, transparent 40%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer content */}
        <div className="pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group no-tap-highlight">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-gold flex-shrink-0"
              >
                <span className="text-charcoal font-serif font-bold text-lg">L</span>
              </motion.div>
              <span className="font-serif text-xl font-bold text-white group-hover:text-gold transition-colors">L'Élégance</span>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs text-white/50">
              Where culinary artistry meets timeless elegance. A Michelin-starred experience crafted for the most discerning of palates.
            </p>

            {/* Awards row */}
            <div className="flex items-center gap-3 mb-6">
              {['⭐⭐⭐ Michelin', '🏆 World\'s 50 Best', '🌿 Sustainable'].map((award) => (
                <span key={award} className="text-[10px] px-2 py-1 rounded-full border border-gold/25 text-gold/70 whitespace-nowrap">
                  {award}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-gold/60 hover:text-gold transition-all duration-300"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-serif text-white font-semibold text-base mb-5">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/50 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="font-serif text-white font-semibold text-base mb-5">Visit Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-gold mt-0.5 flex-shrink-0 text-xs">📍</span>
                <span className="leading-relaxed text-white/50">{loc.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-gold text-xs flex-shrink-0">📞</span>
                <a href={`tel:${loc.phone}`} className="text-gold hover:text-gold-light transition-colors">{loc.phone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold mt-0.5 flex-shrink-0 text-xs">✉️</span>
                <a href="mailto:reservations@lelegance.com" className="text-white/50 hover:text-gold transition-colors">reservations@lelegance.com</a>
              </li>
              <li className="flex items-start gap-2.5 mt-2">
                <span className="text-gold mt-0.5 flex-shrink-0 text-xs">⏰</span>
                <div className="text-white/50">
                  <p>Mon–Thu: {loc.hours.weekday}</p>
                  <p>Fri–Sun: {loc.hours.weekend}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="py-8 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-white font-medium">Stay in the know</p>
              <p className="text-xs text-white/40 mt-0.5">Receive exclusive menus, events & private dining offers.</p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email for newsletter"
                className="flex-1 sm:w-56 px-4 py-2.5 bg-white/5 border border-white/15 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-gold text-charcoal text-sm font-semibold rounded-full hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} L'Élégance Restaurant Group. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
              <a key={item} href="#!" className="text-xs text-white/30 hover:text-gold transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
