import { create } from 'zustand';

export const locations = [
  {
    id: 'paris',
    city: 'Paris',
    name: "L'Élégance Paris",
    address: '42 Rue de Rivoli, 75001 Paris, France',
    phone: '+33 1 42 60 82 00',
    hours: {
      weekday: '18:00 – 23:00',
      weekend: '12:00 – 23:30',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3364881!3d48.8583701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sen!2sfr!4v1234567890',
    currency: 'EUR',
    symbol: '€',
    rate: 0.9,
  },
  {
    id: 'new-york',
    city: 'New York',
    name: "L'Élégance New York",
    address: '150 Central Park South, New York, NY 10019, USA',
    phone: '+1 212-555-0199',
    hours: {
      weekday: '17:30 – 22:30',
      weekend: '11:30 – 23:00',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.142293795014!2d-73.9780035!3d40.7659346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f9cfcb250d%3A0xdb570dd8b1409962!2sCentral%20Park%20South%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890',
    currency: 'USD',
    symbol: '$',
    rate: 1.0,
  },
  {
    id: 'london',
    city: 'London',
    name: "L'Élégance London",
    address: '100 Piccadilly, London W1J 7NH, United Kingdom',
    phone: '+44 20 7946 0958',
    hours: {
      weekday: '18:00 – 23:00',
      weekend: '12:00 – 23:00',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.278553272935!2d-0.1441865!3d51.507204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876052d43d3e6cb%3A0x6b772428588820c7!2sPiccadilly%2C%20London!5e0!3m2!1sen!2suk!4v1234567890',
    currency: 'GBP',
    symbol: '£',
    rate: 0.8,
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    name: "L'Élégance Tokyo",
    address: '3-1-1 Roppongi, Minato-ku, Tokyo 106-0032, Japan',
    phone: '+81 3-5555-0144',
    hours: {
      weekday: '17:00 – 23:00',
      weekend: '11:30 – 22:30',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7479754291886!2d139.7290726!3d35.6610058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b77cc4bcf57%3A0x2774db8cf65f14bd!2sRoppongi%20Hills!5e0!3m2!1sen!2sjp!4v1234567890',
    currency: 'JPY',
    symbol: '¥',
    rate: 150,
  },
];

export const useLocationStore = create((set, get) => ({
  selectedLocation: JSON.parse(localStorage.getItem('luxury_restaurant_location')) || null,
  showPopup: !localStorage.getItem('luxury_restaurant_location'),
  
  setLocation: (loc) => {
    localStorage.setItem('luxury_restaurant_location', JSON.stringify(loc));
    set({ selectedLocation: loc, showPopup: false });
  },
  
  setShowPopup: (show) => set({ showPopup: show }),
  
  formatPrice: (usdPrice) => {
    const loc = get().selectedLocation || locations[0]; // fallback to Paris
    const converted = Math.round(usdPrice * loc.rate);
    if (loc.id === 'tokyo') {
      return `${loc.symbol}${converted.toLocaleString()}`;
    }
    return `${loc.symbol}${converted}`;
  },
}));
