import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '../../routes/routes';

export const Contact: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Support | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get in touch with the GenzVerse support team. Submit general feedback, bug reports, feature requests, or business inquiries.');
    }
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill out all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been sent! We will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  const contactOptions = [
    { icon: <Mail className="h-5 w-5 text-indigo-500" />, title: 'Email Support', detail: 'ramamanoj2003@gmail.com', desc: 'Direct general and developer helpdesk.' },
    { icon: <Phone className="h-5 w-5 text-pink-500" />, title: 'Creator Hotline', detail: '+91 8328665583', desc: 'Mon-Fri 9am - 5pm IST' },
    { icon: <MapPin className="h-5 w-5 text-purple-500" />, title: 'Headquarters', detail: 'Chilamakuru, Andhra Pradesh', desc: 'Andhra Pradesh, India' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-10">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Support Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          Get in{' '}
          <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Touch
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Have a question about publishing, notifications, developer tools, or account privacy? Drop us a line.
        </p>
      </motion.div>

      {/* Main Grid: Form Left, Info Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container: Column 7 */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-5"
        >
          <h2 className="text-lg font-black text-slate-855 dark:text-slate-100 uppercase tracking-wider">
            Send a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Rivers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Category Inquiry</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold cursor-pointer"
              >
                <option value="General Feedback">General Feedback</option>
                <option value="Technical Support">Technical Support / Bug Report</option>
                <option value="Account Privacy">Account privacy & Safety</option>
                <option value="Feature Inquiry">Feature Recommendation</option>
                <option value="Commercial Inquiry">Business / Press Collaboration</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Your Message *</label>
              <textarea
                required
                rows={5}
                placeholder="What can GenzVerse support team assist you with?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all leading-relaxed font-semibold resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Submitting request...</span>
                </>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" />
                  <span>Send Support Request</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Info Sidebar: Column 5 */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Quick Helpdesk Cards */}
          <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest pb-3 border-b border-slate-100 dark:border-slate-800">
              Helpdesk Options
            </h3>
            
            <div className="space-y-4">
              {contactOptions.map((opt) => (
                <div key={opt.title} className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/45 rounded-2xl transition">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 h-fit shrink-0">
                    {opt.icon}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wide">{opt.title}</h4>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-150 truncate">{opt.detail}</p>
                    <p className="text-[10px] text-slate-400">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ CTA Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-44">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
              <HelpCircle className="h-28 w-28" />
            </div>
            <div>
              <h4 className="text-base font-black flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Explore Common FAQs
              </h4>
              <p className="text-[11px] text-indigo-100 leading-relaxed mt-2 max-w-xs">
                Before reaching out, check our detailed FAQ page. We cover quick account configurations, follow alerts, comments, and visibility options.
              </p>
            </div>
            <Link
              to={ROUTES.FAQ}
              className="inline-flex items-center gap-1 bg-white text-indigo-600 font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg hover:bg-slate-50 transition w-fit mt-3"
            >
              Check FAQ
            </Link>
          </div>

        </motion.div>
        
      </div>
    </div>
  );
};

export default Contact;
