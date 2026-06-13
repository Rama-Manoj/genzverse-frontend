import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass, Laptop, Paintbrush, Coffee, Terminal, Briefcase, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';

interface CategoryItem {
  name: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    name: 'Technology',
    desc: 'Gadgets, setups, mobile tech, and next-generation frameworks reviews.',
    icon: <Laptop className="h-6 w-6" />,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/10',
  },
  {
    name: 'Design',
    desc: 'UI/UX layout templates, typography variables, graphic design tools, and Figma guides.',
    icon: <Paintbrush className="h-6 w-6" />,
    gradient: 'from-pink-500 to-rose-600',
    shadow: 'shadow-rose-500/10',
  },
  {
    name: 'Lifestyle',
    desc: 'Workspace setups, productivity tips, developer diaries, and tech culture.',
    icon: <Coffee className="h-6 w-6" />,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-orange-500/10',
  },
  {
    name: 'Programming',
    desc: 'Code optimization, React tutorials, backend algorithms, databases, and APIs.',
    icon: <Terminal className="h-6 w-6" />,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/10',
  },
  {
    name: 'Career',
    desc: 'Interview preparations, resume tips, remote work hacks, and tech industry career advice.',
    icon: <Briefcase className="h-6 w-6" />,
    gradient: 'from-purple-500 to-indigo-500',
    shadow: 'shadow-purple-500/10',
  },
  {
    name: 'AI',
    desc: 'Machine learning, large language models, ChatGPT prompts, and future automated software.',
    icon: <Cpu className="h-6 w-6" />,
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/10',
  },
];

export const Categories: React.FC = () => {
  const { useBlogsQuery } = useBlogs();
  const { data: blogs = [] } = useBlogsQuery();

  useEffect(() => {
    document.title = 'Browse Categories | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore GenzVerse publications divided into tech development, UI/UX design, lifestyle, AI, and developer career categories.');
    }
  }, []);

  // Compute total blogs per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach((b) => {
      if (b.category) {
        const key = b.category.toLowerCase().trim();
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [blogs]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="h-3.5 w-3.5" />
          <span>Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          Browse by{' '}
          <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Category
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Explore curated content collections tailored around specific modern developer topics.
        </p>
      </motion.div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map((cat, index) => {
          const count = categoryCounts[cat.name.toLowerCase().trim()] || 0;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-3xl border border-slate-200/55 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Icon Header */}
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-md ${cat.shadow} w-fit`}>
                  {cat.icon}
                </div>
                
                {/* Details */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-6">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {count} {count === 1 ? 'Publication' : 'Publications'}
                </span>
                
                <Link
                  to={`/category/${cat.name.toLowerCase()}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 group/link"
                >
                  <span>Explore Feed</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
};

export default Categories;
