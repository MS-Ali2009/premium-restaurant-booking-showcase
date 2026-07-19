import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const blogsData = [
  {
    id: 1,
    title: 'The Art of Truffle Hunting: Our Journey to Périgord',
    description: 'We ventured deep into the forests of Périgord with master truffle hunters to source the finest black diamonds for our winter menu.',
    content: `Every winter, long before the first light breaks over the Dordogne valley, our sourcing team joins the legendary truffle hunters of Périgord in a ritual that has endured for centuries. Armed with trained dogs — Labradors renowned for their sensitive noses — we trek through ancient oak forests, following invisible trails of earthly perfume. \n\nThe black truffle, Tuber melanosporum, grows only in specific symbiotic relationships with the roots of oak trees. It cannot be manufactured, farmed at scale, or hurried. It demands patience, expertise, and above all, respect for nature's timetable. \n\nWhen we finally unearth a specimen — sometimes no larger than a walnut, sometimes the size of a clenched fist — the emotion is comparable to striking gold. Each truffle carries within it the memory of the soil, the rainfall, the mineral richness of this particular piece of earth. \n\nChef Laurent Dubois selects only the finest, discarding any that don't meet the strict aromatic standards of L'Élégance. The chosen truffles are transported overnight in refrigerated conditions and arrive at our kitchen before service, where they are incorporated into dishes with reverence. \n\nThe truffle, for us, is not merely an ingredient. It is a philosophy — an insistence that the greatest luxury comes not from excess, but from rarity embraced with humility.`,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
    author: 'Chef Laurent Dubois',
    date: '2026-01-15',
    category: 'Behind the Kitchen',
    readTime: '6 min read',
  },
  {
    id: 2,
    title: 'Fermentation: The Living Heart of Modern Cuisine',
    description: 'How L\'Élégance is embracing ancient preservation techniques to create complex, layered flavours that surprise and delight.',
    content: `Fermentation is the oldest form of culinary transformation known to humanity, yet it is only now receiving the recognition it deserves in fine dining. At L'Élégance, our fermentation programme — housed in a dedicated cellar beneath the restaurant — represents one of our most exciting areas of innovation. \n\nChef Laurent first encountered the transformative power of lacto-fermentation during a research trip to Osaka, where he spent three weeks studying with a miso master whose family had maintained the same fermentation vessel for over 200 years. The experience changed his understanding of time as an ingredient. \n\nOur current fermentation projects include: a 12-month aged miso produced from locally grown barley and black beans; a series of vegetable garrums that add extraordinary umami depth to our stocks; wild-fermented hot sauces using peppers from our kitchen garden; and a rotating selection of house-made vinegars — currently featuring a champagne vinegar aged with herbs de Provence. \n\nThe results speak for themselves. A simple dish of roasted carrots becomes a meditation on sweetness and acidity when finished with our carrot-top garum. Our signature beef consommé achieves an impossible depth of flavour through the addition of our aged miso tare. \n\nFermentation teaches us that the best cuisine is never truly finished — it is always evolving, living, and surprising.`,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop',
    author: 'Sous Chef Marie Leclerc',
    date: '2026-02-08',
    category: 'Culinary Science',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Selecting the Perfect Burgundy: A Sommelier\'s Confession',
    description: 'Our head sommelier shares the intimate process of building a wine list that complements but never overwhelms the cuisine.',
    content: `Building a wine list for a three-Michelin-star restaurant is an exercise in restraint as much as in extravagance. Anybody can list expensive bottles. The true art lies in finding wines at every price point that genuinely elevate the experience of eating here. \n\nMy philosophy begins with the food. Before I add a single bottle to the list, I taste every dish on the current menu obsessively, noting the weight, acidity, sweetness, and textural profile of each preparation. Only then do I begin the process of matching. \n\nBurgundy occupies a special place in our cellar. The Pinot Noir grape, grown on the limestone slopes of the Côte d'Or, produces wines of extraordinary finesse and haunting mineral character — a quality the French call terroir. When paired with our duck confit or rack of lamb, a village-level Gevrey-Chambertin creates a conversation between earth and fire that is greater than the sum of its parts. \n\nBut I am equally proud of our selection of natural wines from smaller producers — bottles that might shock traditionalists but delight curious guests. Our list features a zero-sulphur Chenin Blanc from the Loire that pairs beautifully with our tuna tartare, and a skin-contact Pinot Gris from Alsace that transforms our foie gras course entirely. \n\nWine, at its finest, is a time machine. Each bottle carries within it a specific vintage, a specific place, a specific human being's vision. Our job is to find the right moment to uncork that vision.`,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=500&fit=crop',
    author: 'Head Sommelier Antoine Beaumont',
    date: '2026-03-20',
    category: 'Wine & Spirits',
    readTime: '7 min read',
  },
  {
    id: 4,
    title: 'The Pastry Kitchen: Where Science Meets Poetry',
    description: 'A rare glimpse into the world of our head pastry chef, where temperature, timing, and artistry intersect.',
    content: `The pastry kitchen is a different world from the savory kitchen. Here, imprecision is not a virtue but a catastrophe. A soufflé that is two degrees too cool will collapse. A chocolate tempered at the wrong temperature will bloom. A custard left on heat thirty seconds too long becomes scrambled eggs. \n\nAnd yet, within these rigid parameters, there is extraordinary creative freedom. My role as head pastry chef at L'Élégance is to find beauty at the intersection of chemistry and emotion. \n\nOur signature Valrhona chocolate soufflé has been on the menu since 2008, and it remains our most requested dessert. The recipe has evolved subtly over the years — we now incorporate a smoked crème anglaise that adds a whisper of complexity without disrupting the purity of the chocolate. The soufflé rises in precisely twelve minutes, and must be served within thirty seconds of leaving the oven. This constraint, rather than limiting us, focuses the entire service. \n\nI am currently working on a new dessert inspired by a memory of my grandmother's kitchen in Brittany: the smell of buckwheat crêpes on a Sunday morning, the salted caramel cooling on the windowsill, the wind carrying the scent of the sea. How does one translate a memory into a dessert? Very carefully, and with great respect for what is being remembered. \n\nThe pastry kitchen teaches me, every day, that the most extraordinary things happen at the boundaries of what is possible.`,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=500&fit=crop',
    author: 'Pastry Chef Sophie Moreau',
    date: '2026-04-12',
    category: 'Behind the Kitchen',
    readTime: '9 min read',
  },
  {
    id: 5,
    title: 'Dining as a Ritual: The Philosophy of Slow Food',
    description: 'In an age of instant gratification, L\'Élégance makes a case for the radical act of sitting still and savouring.',
    content: `In contemporary culture, speed is currency. We are rewarded for doing more, faster. The two-hour lunch has become an act of rebellion; the multi-course dinner, a political statement. \n\nAt L'Élégance, we make no apology for asking our guests to surrender time. A full tasting menu here lasts between three and four hours. This is not an accident. It is a deliberate design. \n\nThe slow meal has deep roots in European dining culture — in the French tradition of the long Sunday lunch, the Italian philosophy of la dolce vita, the Spanish institution of the sobremesa, that delicious period after eating when conversation flows freely and no one reaches for their phone. These traditions are not inefficiencies. They are technologies of human connection. \n\nOur tasting menu is structured to create a sense of narrative arc. The early courses are light — bright acidity, fresh herbs, delicate textures — designed to awaken the senses. As the meal progresses, the flavours deepen and intensify. The main courses are grounding, substantial, satisfying. The desserts provide resolution and, ideally, a kind of gentle melancholy — the beautiful sadness of something wonderful coming to its end. \n\nWe also believe in the importance of silence. Between courses, we do not hurry. We allow guests time to reflect, to digest, to notice. Dining, in its truest form, is not consumption. It is contemplation.`,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=500&fit=crop',
    author: 'Chef Laurent Dubois',
    date: '2026-05-05',
    category: 'Philosophy & Culture',
    readTime: '5 min read',
  },
  {
    id: 6,
    title: 'Zero Waste Kitchen: Our Commitment to Sustainable Luxury',
    description: 'How we are reimagining every ingredient\'s potential and working towards a kitchen that wastes nothing.',
    content: `The concept of zero waste is not new to traditional cooking. Our grandmothers knew instinctively that carrot tops could be made into pesto, that stale bread could become croutons, that bones could be simmered into stocks of extraordinary richness. Somewhere in the twentieth century, this wisdom was lost in the rush toward convenience and disposability. We are recovering it. \n\nAt L'Élégance, our zero-waste programme began in 2019 and has fundamentally transformed our kitchen practice. Every ingredient that enters our kitchen is considered holistically — not just for its primary use, but for every possible secondary and tertiary application. \n\nLeeks, for example: the tender white and pale green portions are used in our classic dishes. The darker green tops are blended into a vibrant herb oil. The outermost leaves are dehydrated and ground into a powder that seasons our bread. The roots are composted and returned to the kitchen garden. Nothing is wasted. \n\nWe work closely with our suppliers to reduce packaging, choosing to receive deliveries in reusable containers wherever possible. Our kitchen oil is collected and processed into biodiesel. Our coffee grounds are donated to local gardeners for use as soil amendment. \n\nWe are not perfect, and we do not claim to be. But we believe that true luxury carries with it a responsibility — to the land that provides our ingredients, to the communities around us, and to the generations who will inherit this planet. Sustainability is not a constraint on excellence. It is a condition of it.`,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop',
    author: 'Executive Chef Team',
    date: '2026-06-18',
    category: 'Sustainability',
    readTime: '7 min read',
  },
];

function BlogModal({ blog, onClose }) {
  if (!blog) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-xl overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative max-w-3xl w-full bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-charcoal/10 dark:border-white/5 shadow-2xl z-10 my-8"
        >
          <div className="h-72 overflow-hidden relative">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-charcoal/60 text-white flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="px-3 py-1 bg-gold text-charcoal text-xs rounded-full font-semibold">{blog.category}</span>
            </div>
          </div>

          <div className="p-8">
            <h2 className="font-serif text-3xl text-charcoal dark:text-white font-bold mb-3">{blog.title}</h2>
            <div className="flex items-center gap-4 text-xs text-charcoal/40 dark:text-white/40 mb-6">
              <span>✍️ {blog.author}</span>
              <span>📅 {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>⏱ {blog.readTime}</span>
            </div>
            <div className="text-charcoal/70 dark:text-white/70 leading-relaxed text-sm space-y-4">
              {blog.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Blogs() {
  const [search, setSearch] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const filtered = useMemo(() =>
    blogsData.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Stories & Insights</p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">Our Blog</h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto">
                Dive behind the scenes of L'Élégance — from truffle hunts and wine selections to the philosophy of slow dining.
              </p>
            </div>
          </ScrollReveal>

          {/* Search */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-lg mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles, authors, categories..."
                  className="w-full px-6 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-full text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* Blog Grid */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <span className="text-5xl block mb-4">📰</span>
              <p className="font-serif text-2xl text-charcoal dark:text-white mb-2">No Articles Found</p>
              <p className="text-charcoal/40 dark:text-white/40">Try a different keyword or browse all articles by clearing the search.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((blog, i) => (
                  <motion.div
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      onClick={() => setSelectedBlog(blog)}
                      className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-charcoal/10 dark:border-white/5 cursor-pointer h-full flex flex-col"
                    >
                      <div className="h-52 overflow-hidden relative">
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.5 }}
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-charcoal text-xs rounded-full font-semibold">
                          {blog.category}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-charcoal/40 dark:text-white/40 mb-3">
                          <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{blog.readTime}</span>
                        </div>
                        <h3 className="font-serif text-xl text-charcoal dark:text-white font-bold mb-3 group-hover:text-gold transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                          {blog.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-charcoal/40 dark:text-white/40">By {blog.author}</span>
                          <span className="text-gold text-sm font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                            Read More
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}
      </AnimatePresence>
    </PageTransition>
  );
}
