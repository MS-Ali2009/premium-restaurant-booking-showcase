import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-charcoal dark:bg-charcoal text-white/70 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-2xl text-gold mb-4">L'Élégance</h3>
              <p className="text-sm leading-relaxed">
                Where culinary artistry meets timeless elegance. An unforgettable
                dining experience crafted for the discerning palate.
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Navigate</h4>
            <ul className="space-y-2">
              {[
                { to: '/menu', label: 'Our Menu' },
                { to: '/booking', label: 'Reservations' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/about', label: 'About Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>42 Rue de Rivoli</li>
              <li>Paris, 75001 France</li>
              <li className="text-gold">+33 1 42 60 82 00</li>
              <li>reservations@lelegance.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday – Thursday</li>
              <li className="text-gold">18:00 – 23:00</li>
              <li className="mt-3">Friday – Sunday</li>
              <li className="text-gold">12:00 – 23:30</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} L'Élégance. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {['Instagram', 'Facebook', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#!"
                className="text-xs hover:text-gold transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
