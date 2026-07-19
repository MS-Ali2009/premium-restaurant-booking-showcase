# L'Élégance – Premium Restaurant Website

A luxury, multi-page front-end restaurant website built with React.js, Tailwind CSS, and Framer Motion. This is a showcase project demonstrating premium UI/UX design with immersive animations, a complete booking system with QR code generation/scanning, and responsive design.

![React](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React.js 18** | UI framework (functional components, hooks) |
| **React Router v6** | Multi-page routing with animated transitions |
| **Tailwind CSS 3** | Utility-first styling (no external CSS) |
| **Framer Motion** | Animations, page transitions, micro-interactions |
| **React Hook Form + Yup** | Form handling & validation |
| **html5-qrcode** | QR code scanner (camera-based) |
| **qrcode.react** | QR code generation |
| **Zustand / Context API** | State management (bookings, theme) |
| **React Hot Toast** | Toast notifications |
| **Axios** | HTTP client with placeholder interceptors |
| **LocalStorage** | Persistent booking data (no backend required) |

---

## Pages & Routes

| Route | Page | Features |
|---|---|---|
| `/` | Home | Cinematic hero, parallax, animated stats, featured dishes, testimonials, CTA |
| `/menu` | Menu | Categorized grid, animated filtering, search, 3D tilt dish cards |
| `/booking` | Book a Table | Multi-step wizard, live availability simulation, QR code on success |
| `/reservations` | My Reservations | Booking list, filters, expandable cards, cancel/modify |
| `/scanner` | QR Scanner | Live camera scanner, manual entry fallback, booking verification |
| `/gallery` | Gallery | Masonry layout, lightbox with zoom, lazy loading |
| `/about` | About & Contact | Chef story, interactive timeline, contact form, Google Maps |
| `*` | 404 | Animated error page with floating elements |

---

## Setup & Installation

```bash
# Clone the repository
git clone <repo-url>
cd luxury-restaurant

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at (https://ms-ali2009.github.io/premium-restaurant-booking-showcase/).

### Production Build

```bash
npm run build
```

---

## Features

### Design
- **Dark luxury theme** with charcoal, gold, and burgundy palette
- **Glassmorphism** cards and **neumorphic** buttons
- **Playfair Display** serif headings + **Inter** sans-serif body
- Fully responsive (mobile-first, 640px/768px/1024px/1280px breakpoints)
- Dark/Light theme toggle

### Animations (Framer Motion)
- Page transitions (fade + slide)
- Scroll-triggered reveals with staggered children
- Hover effects: scale, glow, 3D tilt
- Mouse-follow parallax on hero
- Floating particles
- Animated progress bars and loading spinners
- Toast notification slide-in

### Booking System
- Multi-step form wizard with animated progress
- Live availability simulation (10 tables per 30-min slot)
- Client-side double-booking prevention
- Booking stored in localStorage
- QR code generated with booking reference
- Cancel/modify with confirmation dialogs

### QR Scanner
- Live camera scanning using `html5-qrcode`
- Manual ID entry fallback
- Booking verification with "Verified" animation
- "Already scanned" detection

---

## Testing the QR Scanner

1. **Create a booking**: Go to `/booking` and complete the reservation form
2. **View QR code**: After submission, a QR code is shown in the success modal
3. **Scan it**: Navigate to `/scanner` and scan the QR code from screen or use manual entry
4. **Verify**: The booking details will appear in a verification modal

### Sample QR Test
You can also manually test by:
1. Going to `/reservations`
2. Expanding any booking card
3. Copying the Reference ID
4. Pasting it in the Scanner's manual entry field

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── PageTransition.js
│   ├── ScrollReveal.js
│   └── LoadingSpinner.js
├── context/          # React Context providers
│   ├── ThemeContext.js
│   └── BookingContext.js
├── data/             # Static data (menu items, gallery, testimonials)
│   └── menuData.js
├── pages/            # Route-level page components
│   ├── Home.js
│   ├── Menu.js
│   ├── Booking.js
│   ├── Reservations.js
│   ├── Scanner.js
│   ├── Gallery.js
│   ├── About.js
│   └── NotFound.js
├── utils/            # Utilities
│   └── axios.js
├── App.js            # Root component with routing
├── index.js          # Entry point
└── index.css         # Tailwind directives + custom utilities
```

---

## Deployment

This project can be deployed to any static hosting platform:

```bash
npm run build
# Deploy the /build folder to Vercel, Netlify, etc.
```

For client-side routing to work, configure your hosting to redirect all routes to `index.html`.

---

## License

MIT
