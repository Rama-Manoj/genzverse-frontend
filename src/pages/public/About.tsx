import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Target, Sparkles, Heart, Users, ShieldCheck, ArrowRight,
  Code2, Globe, GraduationCap, Award, Briefcase, ExternalLink,
  Github, Linkedin, Mail, Phone, MapPin, Layers, Rocket, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import creatorBanner from '../../assets/creator_banner.png';
import manojAvatar from '../../assets/IMG_Manoj.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export const About: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn more about GenzVerse — the ultimate social blogging platform built for next-generation content creators, developers, and thinkers. Meet the creator Rama Manoj.'
      );
    }
  }, []);

  const stats = [
    { label: 'Active Creators', value: '500+', icon: Users },
    { label: 'Articles Published', value: '2K+', icon: BookOpen },
    { label: 'Categories', value: '15+', icon: Layers },
    { label: 'Daily Readers', value: '5K+', icon: Zap },
  ];

  const values = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Raw Creativity',
      desc: 'We support authentic voices. No filters, no corporate censorship — just bold ideas that push boundaries.',
      gradient: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Aesthetic Focus',
      desc: 'Visual experience matters. We bridge premium design and functional developer writing beautifully.',
      gradient: 'from-pink-500 to-rose-600',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Creator Community',
      desc: 'Build followings, track analytics, and collaborate with like-minded creators worldwide.',
      gradient: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'User Sovereignty',
      desc: 'Your data, your control. Privacy settings and visibility options built with security-first principles.',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
  ];

  const timeline = [
    {
      year: '2026',
      title: 'The Spark',
      desc: 'GenzVerse was conceived by a passionate full-stack developer tired of cluttered, uninspiring tech blogs.',
      color: 'bg-purple-500',
    },
    {
      year: '2026',
      title: 'Beta Launch',
      desc: 'Rolled out interactive feeds, real-time comments, rich-text editor, and visual tools for early testing communities.',
      color: 'bg-fuchsia-500',
    },
    {
      year: '2026',
      title: 'Going Global',
      desc: 'Expanding features — real-time notifications, creator monetization, categories exploration, and admin dashboards.',
      color: 'bg-pink-500',
    },
  ];

  const skills = [
    { category: 'Programming', items: ['Java', 'JavaScript'] },
    { category: 'Web', items: ['HTML', 'CSS', 'React', 'Servlets', 'JSP'] },
    { category: 'Frameworks', items: ['Spring', 'Spring Boot', 'Hibernate'] },
    { category: 'Database', items: ['MySQL'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'REST APIs'] },
  ];

  const projects = [
    {
      name: 'GenzVerse',
      desc: 'A full-featured social blogging platform with real-time feeds, comments, user analytics, admin panel, and premium glassmorphism UI.',
      tech: ['React', 'Spring Boot', 'MySQL'],
    },
    {
      name: 'AI Web Application',
      desc: 'Full-stack AI chat application using Java and Spring Boot with REST APIs, enabling real-time user interaction and dynamic response generation.',
      tech: ['Java', 'Spring Boot', 'REST APIs'],
    },
    {
      name: 'Bird Sounds Website',
      desc: 'Interactive platform with 20+ bird sounds using HTML, CSS, and JavaScript.',
      tech: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      name: 'Simple Interest Calculator',
      desc: 'Date-based financial calculator with accurate computation.',
      tech: ['JavaScript', 'HTML'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pt-0 pb-12 px-4 sm:px-0">

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative text-center space-y-5 overflow-hidden"
      >
        {/* Decorative blurs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-br from-purple-400/20 via-fuchsia-400/15 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div variants={fadeUp} custom={0} className="relative">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 text-purple-600 dark:text-purple-400 text-[11px] font-black uppercase tracking-widest">
            <Rocket className="h-3.5 w-3.5" />
            About GenzVerse
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="relative text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 dark:text-slate-100 leading-[1.1]"
        >
          Where Next-Gen Writers{' '}
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Define Tomorrow
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="relative text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          GenzVerse is a premium visual playground built for next-generation developers, designers, and
          thinkers to share knowledge, build communities, and inspire the world.
        </motion.p>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STATS BAR                                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={scaleIn}
            custom={i}
            className="relative group text-center p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 backdrop-blur-lg hover:border-purple-300 dark:hover:border-purple-800 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <stat.icon className="h-5 w-5 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MISSION SECTION                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-10"
      >
        <div className="space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            <Heart className="h-3 w-3" />
            Our Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Bridging Creativity &{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Corporate blogs are dry, and traditional social feeds are overly brief.
            GenzVerse is the bridge — a space for deep-dives, developer tutorials, career
            guides, and design thoughts that are as visually stimulating as they are informative.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our platform features dark-mode optimization, premium typography, real-time
            feedback loops, and advanced dashboard metrics to empower every creator.
          </p>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-2xl shadow-purple-500/5">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CORE VALUES                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Core Values
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            What We Stand For
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              custom={i}
              className={`group relative p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 ${v.bg} backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`} />
              <div className="relative flex gap-4">
                <div className={`shrink-0 p-3 rounded-xl bg-gradient-to-br ${v.gradient} text-white shadow-lg`}>
                  {v.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-[15px] text-slate-800 dark:text-slate-100">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TIMELINE                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-10"
      >
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black uppercase tracking-widest">
            <Heart className="h-3 w-3" />
            Our Journey
          </span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Timeline & Milestones
          </h2>
        </div>

        <div className="relative ml-4">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500 via-fuchsia-500 to-pink-500 rounded-full" />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                className="relative pl-8"
              >
                {/* Node */}
                <span className={`absolute left-[-5px] top-1.5 h-3 w-3 rounded-full ${item.color} ring-4 ring-white dark:ring-slate-900 shadow-lg`} />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <span className="text-xs font-black text-purple-500 tracking-wider uppercase">
                    {item.year}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ABOUT THE CREATOR                                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest">
            <Code2 className="h-3 w-3" />
            Meet the Creator
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Built by{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Rama Manoj
            </span>
          </h2>
        </div>

        {/* Creator Profile Card */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="relative rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden"
        >
          {/* Gradient header strip */}
          <div 
            className="h-56 sm:h-80 lg:h-96 bg-slate-900 relative bg-cover bg-[center_10%] bg-no-repeat"
            style={{ backgroundImage: `url(${creatorBanner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
          </div>

          <div className="px-6 sm:px-10 pb-8 relative z-10">
            {/* Avatar area */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={manojAvatar}
                alt="Rama Manoj"
                className="h-24 w-24 sm:h-28 sm:w-28 -mt-12 sm:-mt-16 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl object-cover shrink-0 relative z-20"
              />
              <div className="flex-1 pb-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  Rama Manoj
                </h3>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Java Full Stack Developer
                </p>
              </div>
              <div className="flex gap-2.5 pb-1">
                <a
                  href="mailto:ramamanoj2003@gmail.com"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-600 transition-all"
                  title="Email"
                >
                  <Mail className="h-5.5 w-5.5" />
                </a>
                <a
                  href="https://linkedin.com/in/rama-manoj-2b1012293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5.5 w-5.5" />
                </a>
                <a
                  href="https://github.com/Rama-Manoj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-all"
                  title="GitHub"
                >
                  <Github className="h-5.5 w-5.5" />
                </a>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5 space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Java Full Stack Developer skilled in Java, Servlets, JSP, Spring, Spring Boot,
                Hibernate, JDBC, and MySQL. Built 5+ projects including an AI-powered web
                application with real-time interaction and cloud deployment. Strong in REST
                APIs, MVC architecture, and database-driven applications.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Chilamakuru, Andhra Pradesh
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> +91 8328665583
                </span>
              </div>
            </div>

            {/* Skills + Education + Projects grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* SKILLS */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 space-y-4"
              >
                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                  <Code2 className="h-4 w-4 text-purple-500" />
                  Technical Skills
                </h4>
                <div className="space-y-3">
                  {skills.map((s) => (
                    <div key={s.category}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                        {s.category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/50 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* EDUCATION & CERTIFICATIONS */}
              <motion.div
                variants={fadeUp}
                custom={2}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 space-y-5"
              >
                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  Education
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">MCA</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sri Krishnadevaraya University
                    </p>
                    <p className="text-[10px] font-semibold text-purple-500">2024 – 2026</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">B.Com (CA)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Srinivasa Degree College
                    </p>
                    <p className="text-[10px] font-semibold text-purple-500">2020 – 2023</p>
                  </div>
                </div>

                <hr className="border-slate-200/50 dark:border-slate-800/50" />

                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                  <Award className="h-4 w-4 text-amber-500" />
                  Certifications
                </h4>
                <div className="space-y-2.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Full Stack Web Development
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tap Academy (2024)
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Full Stack Internship
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Aspiron Khuze Technologies (2024)
                    </p>
                  </div>
                </div>

                <hr className="border-slate-200/50 dark:border-slate-800/50" />

                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                  <Briefcase className="h-4 w-4 text-emerald-500" />
                  Training
                </h4>
                <div className="space-y-2.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Java Full Stack Training
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tap Academy · Sep 2023 – Apr 2024
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Full Stack Training (Internship)
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      AK Technologies · Jan 2023 – Jun 2023
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* PROJECTS */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 space-y-4"
              >
                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                  <Globe className="h-4 w-4 text-fuchsia-500" />
                  Featured Projects
                </h4>
                <div className="space-y-4">
                  {projects.map((p) => (
                    <div
                      key={p.name}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/40 space-y-2 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Rocket className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {p.name}
                        </h5>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-[9px] font-bold uppercase tracking-wider"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CTA                                                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-60" />

        <div className="relative p-8 sm:p-12 text-center text-white space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black">
            Ready to Publish Your Story?
          </h3>
          <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
            Join the GenzVerse creator community. Start drafting articles, gain followers,
            and track your views & likes analytics — all in one platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 hover:bg-slate-50 rounded-full font-bold text-xs shadow-xl transition hover:scale-105"
            >
              <span>Write on GenzVerse</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={ROUTES.EXPLORE}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white border border-white/25 hover:bg-white/25 rounded-full font-bold text-xs transition hover:scale-105"
            >
              <span>Explore Articles</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
