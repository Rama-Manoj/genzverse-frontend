import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageSquare, ShieldCheck, PenTool } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'creation' | 'social';
}

export const FAQ: React.FC = () => {
  useEffect(() => {
    document.title = 'Frequently Asked Questions | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find answers to common questions about publishing, following creator profiles, notification settings, and themes on GenzVerse.');
    }
  }, []);

  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'creation' | 'social'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question: 'What is GenzVerse?',
      answer: 'GenzVerse is a modern, visual blogging and social networking playground custom-designed for next-generation developer creators. We support rich blog writing, horizontal navigation categories, responsive dark-mode views, comments, likes, and creator-following feeds.',
    },
    {
      category: 'creation',
      question: 'How do I publish a new article?',
      answer: 'Once logged in, click the "Write" button in the navigation header or left sidebar to open the Blog Editor. You can choose a custom title, set a category, add tag keywords, upload a cover thumbnail, and format your markdown content. Use the "Live Preview" tab to review your post mockup before publishing.',
    },
    {
      category: 'social',
      question: 'How do follows and follow back notifications work?',
      answer: 'When you find a creator whose publications you enjoy, click the "Follow" button on their card or author profile. This will instantly build a custom follow index, increment their analytics count, and trigger a real-time notification alert on their alerts tab so they can follow you back.',
    },
    {
      category: 'general',
      question: 'Is GenzVerse free to use?',
      answer: 'Absolutely! Writing, reading, liking, bookmarking, and participating in discussions on GenzVerse is free. We do not require any credit cards or subscription models.',
    },
    {
      category: 'creation',
      question: 'Can I edit or delete my publications?',
      answer: 'Yes. If you go to your dashboard ("My Publications") or your profile page tab, you will find an "Edit" button next to all your blogs. Clicking it loads your post into the editor, allowing you to update body text, change thumbnails, edit categories, or delete the post entirely.',
    },
    {
      category: 'social',
      question: 'Where do I configure notification preferences?',
      answer: 'Go to Settings by hovering over your profile avatar in the header and clicking "Profile Settings" or "Settings". Select the "Notifications" tab to toggle email, follower alerts, comments, and like notifications using sleek toggle switches.',
    },
    {
      category: 'general',
      question: 'How do I toggle dark mode?',
      answer: 'Click the Moon/Sun icon in the navigation bar header next to your user menu. The visual layout transition is instant and saves your preference inside theme state.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === 'all' || faq.category === activeCategory
  );

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const categories = [
    { value: 'all' as const, label: 'All FAQs', icon: <HelpCircle className="h-3.5 w-3.5" /> },
    { value: 'general' as const, label: 'General Info', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { value: 'creation' as const, label: 'Writing & Publishing', icon: <PenTool className="h-3.5 w-3.5" /> },
    { value: 'social' as const, label: 'Social & Feed', icon: <MessageSquare className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Need Answers?</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          Frequently Asked{' '}
          <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Questions
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Quick details on how to use GenzVerse tools, follow creators, customize settings, and interact.
        </p>
      </motion.div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              setExpandedIndex(null);
            }}
            className={`flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold transition ${
              activeCategory === cat.value
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                : 'bg-white/40 dark:bg-slate-900/40 text-slate-650 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.div
              layout
              key={faq.question}
              className="rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-sm overflow-hidden"
            >
              {/* Question Click Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-slate-50/45 dark:hover:bg-slate-800/20"
              >
                <span className="text-sm font-black text-slate-800 dark:text-slate-150 leading-relaxed pr-4">
                  {faq.question}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-indigo-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-450 shrink-0" />
                )}
              </button>

              {/* Answer Slide Panels */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
