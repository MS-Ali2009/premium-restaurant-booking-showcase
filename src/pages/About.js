import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const timeline = [
  { year: '1999', title: 'The Beginning', description: "Chef Laurent opens the doors to L'Élégance in the heart of Paris." },
  { year: '2003', title: 'First Star', description: 'Awarded our first Michelin star within four years of opening.' },
  { year: '2008', title: 'Second Star', description: 'Recognized for our innovative seasonal tasting menu and wine program.' },
  { year: '2012', title: 'Global Recognition', description: "Named in the World's 50 Best Restaurants list." },
  { year: '2016', title: 'Third Star', description: 'Achieved the coveted third Michelin star – the highest honor in gastronomy.' },
  { year: '2024', title: 'New Chapter', description: "Unveiled our redesigned dining space and introduced the Chef's Table experience." },
];

const values = [
  { icon: '🌿', title: 'Farm to Table', description: 'We source only the freshest, seasonal ingredients from trusted farms and artisans across Europe and beyond.' },
  { icon: '🔥', title: 'Culinary Mastery', description: 'Each dish is a work of art — born from decades of training, passion, and relentless pursuit of perfection.' },
  { icon: '🤝', title: 'Human Connection', description: 'Dining is a ritual of togetherness. We honour that by creating warmth in every interaction.' },
  { icon: '🌍', title: 'Sustainable Luxury', description: 'True excellence is responsible. Our commitment to sustainability guides every sourcing decision we make.' },
];

export default function About() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Our Story</p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-6">
                About L'Élégance
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-3xl mx-auto text-lg leading-relaxed">
                For over two decades, L'Élégance has been a beacon of culinary excellence. Founded on the belief that dining should be an art form, we craft each experience to be as memorable as it is delicious.
              </p>
            </div>
          </ScrollReveal>

          {/* Chef Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <ScrollReveal direction="left">
              <div className="relative">
                <motion.div whileHover={{ scale: 1.02 }} className="aspect-[3/4] rounded-3xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=800&fit=crop" alt="Chef Laurent Dubois" className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -right-6 bg-gold text-charcoal p-6 rounded-2xl shadow-2xl">
                  <p className="font-serif text-3xl font-bold">25+</p>
                  <p className="text-sm">Years of Excellence</p>
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Master of Flavour</p>
              <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold mb-6">Chef Laurent Dubois</h2>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-4">
                Born in Lyon, France, Chef Laurent's journey began in his grandmother's kitchen. His passion for transforming the finest ingredients into works of art led him to train under Paul Bocuse and Alain Ducasse before opening L'Élégance in 1999.
              </p>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-4">
                His culinary philosophy harmonizes French classical technique with global influences, resulting in dishes that surprise and delight even the most seasoned palates.
              </p>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed italic border-l-4 border-gold/40 pl-5">
                "Food is not just sustenance – it is poetry on a plate. Every ingredient has a story, every dish an emotion. My role is to be the narrator."
              </p>
            </ScrollReveal>
          </div>

          {/* Our Values / Philosophy */}
          <div className="mb-32">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-gold tracking-widest uppercase text-sm mb-3">What We Believe</p>
                <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold">Our Philosophy</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -5 }} className="p-8 bg-white dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-white/5">
                    <span className="text-4xl mb-4 block">{v.icon}</span>
                    <h3 className="font-serif text-xl text-charcoal dark:text-white font-bold mb-3">{v.title}</h3>
                    <p className="text-charcoal/60 dark:text-white/60 text-sm leading-relaxed">{v.description}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-gold tracking-widest uppercase text-sm mb-3">Our Journey</p>
                <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold">A Legacy of Excellence</h2>
              </div>
            </ScrollReveal>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-gold/20 hidden md:block" />
              {timeline.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 0.1}>
                  <div className={`flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                      <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-2xl p-6 inline-block">
                        <span className="text-gold font-serif text-2xl font-bold">{item.year}</span>
                        <h3 className="text-charcoal dark:text-white font-medium text-lg mt-1">{item.title}</h3>
                        <p className="text-charcoal/50 dark:text-white/50 text-sm mt-2">{item.description}</p>
                      </motion.div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-gold border-4 border-cream dark:border-charcoal relative z-10 flex-shrink-0" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
