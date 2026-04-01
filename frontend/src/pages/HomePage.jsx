import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FiArrowRight, FiMic, FiFileText, FiShield, FiEdit3, FiAlertTriangle, FiBarChart2, FiStar } from 'react-icons/fi';
import { supabase } from '../lib/supabaseClient';

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

/* ── Data ── */
const features = [
  { icon: <FiMic />, title: 'Voice Legal Consultant', desc: 'Talk to your AI lawyer in Hindi or English about any legal matter.', link: '/dashboard', color: 'from-amber-500 to-orange-500' },
  { icon: <FiFileText />, title: 'Document Analyzer', desc: 'Upload contracts, agreements — AI flags risky clauses instantly.', link: '/document-analyzer', color: 'from-blue-500 to-cyan-500' },
  { icon: <FiShield />, title: 'Know Your Rights', desc: 'Learn your constitutional & legal rights with exact law citations.', link: '/know-your-rights', color: 'from-emerald-500 to-green-500' },
  { icon: <FiEdit3 />, title: 'Auto Draft Generator', desc: 'Generate RTI, FIR, Legal Notice, Rent Agreement in seconds.', link: '/draft-generator', color: 'from-purple-500 to-pink-500' },
  { icon: <FiAlertTriangle />, title: 'Case Rescue Plan', desc: 'Get personalized legal rescue plans backed by the Constitution.', link: '/case-rescue', color: 'from-red-500 to-rose-500' },
  { icon: <FiBarChart2 />, title: 'Case Tracker', desc: 'Track court cases, hearing dates & get AI-powered next steps.', link: '/case-tracker', color: 'from-indigo-500 to-violet-500' },
];

const steps = [
  { num: '01', title: 'Describe Your Problem', desc: 'Tell us about your legal situation in plain language.' },
  { num: '02', title: 'AI Analyzes Indian Law', desc: 'Our AI scans the Constitution, IPC, CrPC & relevant acts.' },
  { num: '03', title: 'Get Your Action Plan', desc: 'Receive a step-by-step legal roadmap you can follow right away.' },
];

const testimonials = [
  { name: 'Rahul Sharma', location: 'Delhi', text: 'Lex AI helped me understand my tenant rights when my landlord refused to return my deposit. The rescue plan was incredibly detailed.', rating: 5 },
  { name: 'Priya Patel', location: 'Mumbai', text: 'As a small business owner, the document analyzer saved me from a bad vendor contract. It flagged clauses I would never have noticed.', rating: 5 },
  { name: 'Amit Verma', location: 'Bangalore', text: 'Filed my first RTI application using the draft generator. The process was so simple and the draft was professionally written.', rating: 4 },
];

/* ── Scales SVG ── */
const ScalesHero = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="inline-block mr-2">
    <path d="M50 12 L50 72" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
    <path d="M28 30 L72 30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
    <path d="M28 30 L18 52 A14 7 0 0 0 38 52 Z" stroke="#f59e0b" strokeWidth="2" fill="rgba(245,158,11,0.15)" />
    <path d="M72 30 L62 52 A14 7 0 0 0 82 52 Z" stroke="#f59e0b" strokeWidth="2" fill="rgba(245,158,11,0.15)" />
    <path d="M36 72 L64 72" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ── CountUp with InView ── */
function StatNumber({ end, suffix = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <span ref={ref}>
      {inView ? <CountUp end={end} duration={2} suffix={suffix} /> : '0'}
    </span>
  );
}

/* ─────────────────────────────────────────
   HOMEPAGE COMPONENT
   ───────────────────────────────────────── */
export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      if (!supabase) {
        setStats({ cases: 0, documents: 0, drafts: 0, chats: 0 });
        setStatsLoading(false);
        return;
      }
      try {
        const [casesRes, docsRes, draftsRes, chatsRes] = await Promise.all([
          supabase.from('rescue_plans').select('*', { count: 'exact', head: true }),
          supabase.from('documents').select('*', { count: 'exact', head: true }),
          supabase.from('drafts').select('*', { count: 'exact', head: true }),
          supabase.from('chats').select('*', { count: 'exact', head: true }),
        ]);
        setStats({
          cases: casesRes.count || 0,
          documents: docsRes.count || 0,
          drafts: draftsRes.count || 0,
          chats: chatsRes.count || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({ cases: 0, documents: 0, drafts: 0, chats: 0 });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchRealStats();
  }, []);

  return (
    <div className="relative overflow-hidden">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-[90vh] flex items-center px-4 overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-amber-500/[0.06] rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/[0.06] rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-amber-500/20 bg-amber-500/5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-medium text-amber-400/80">AI-Powered Legal Assistant</span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-white">Every Indian</span>
              <br />
              <span className="text-amber-400">Deserves Justice</span>
            </h1>

            <p className="text-lg md:text-xl text-[#94a3b8] max-w-xl mb-10 leading-relaxed">
              Get instant legal guidance, document analysis, and personalized rescue plans — 
              powered by AI and backed by the Indian Constitution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold
                  bg-gradient-to-r from-amber-500 to-amber-600 text-black
                  hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:scale-[1.03]
                  active:scale-[0.97] transition-all duration-300"
              >
                Get Free Legal Help <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/know-your-rights"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold
                  border border-amber-500/30 text-amber-400
                  hover:bg-amber-500/10 hover:border-amber-500/50
                  active:scale-[0.97] transition-all duration-300"
              >
                Know Your Rights
              </Link>
            </div>
          </motion.div>

          {/* Right — Floating card mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="relative group">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              
              <div className="relative bg-[#141824]/80 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 
                shadow-[0_20px_60px_rgba(0,0,0,0.5)] group-hover:border-amber-500/40 
                transition-all duration-500 group-hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Case Rescue Plan</p>
                    <p className="text-amber-400/60 text-xs">AI Analysis Complete</p>
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/30">HIGH</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-white/70 text-sm">File complaint at Consumer Forum</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-white/40 text-sm">Send Legal Notice under CPA 2019</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400/60 text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-white/30 text-sm">Escalate to District Commission</span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
                </div>
                <p className="text-amber-400/50 text-xs mt-2">33% Complete</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ TRUST BAR ══════════════ */}
      <section className="py-12 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { end: statsLoading ? 0 : stats?.cases ?? 0, suffix: '', label: 'Cases Rescued' },
              { end: statsLoading ? 0 : stats?.documents ?? 0, suffix: '', label: 'Docs Analyzed' },
              { end: 99, suffix: '%', label: 'Accuracy' },
              { end: 24, suffix: '/7', label: 'Available' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} custom={i}>
                <p className="text-3xl md:text-4xl font-bold text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {statsLoading && i < 2 ? (
                    <span className="inline-block w-16 h-8 rounded-lg skeleton" />
                  ) : (
                    <StatNumber end={stat.end} suffix={stat.suffix} />
                  )}
                </p>
                <p className="text-[#94a3b8] text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">Everything You Need to Fight for Your Rights</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">
              From understanding your rights to drafting legal documents — Lex AI covers it all.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeInUp} custom={i}>
                <Link
                  to={f.link}
                  className="block p-6 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl
                    border border-[rgba(245,158,11,0.15)] 
                    hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]
                    hover:border-[rgba(245,158,11,0.35)]
                    transition-all duration-300 group h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 
                    shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-xl">{f.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <FiArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Three simple steps to get your legal roadmap.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-[2px]">
              <div className="w-full h-full border-t-2 border-dashed border-amber-500/30" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-[#141824] border-2 border-amber-500/40 
                  flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {step.title}
                </h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">Trusted by Thousands</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Hear from people who fought for their rights with Lex AI.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="p-6 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl
                  border border-[rgba(245,158,11,0.12)] hover:border-[rgba(245,158,11,0.3)]
                  transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <FiStar key={si} className={`w-4 h-4 ${si < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 
                    flex items-center justify-center text-black font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-[#94a3b8] text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-blue-500/10" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-[80px]" />
            
            <div className="relative p-12 md:p-16 text-center bg-[#141824]/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl">
              <ScalesHero />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ready to Know Your Rights?
              </h2>
              <p className="text-[#94a3b8] mb-8 max-w-lg mx-auto">
                Join thousands of Indians who are taking control of their legal situations with AI-powered guidance.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold
                  bg-gradient-to-r from-amber-500 to-amber-600 text-black
                  hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:scale-[1.03]
                  active:scale-[0.97] transition-all duration-300"
              >
                Start for Free <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-[rgba(245,158,11,0.1)] bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo + tagline */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <ScalesHero />
                <span className="text-xl font-bold text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Lex AI
                </span>
              </div>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                AI-powered legal assistant helping every Indian understand and fight for their rights.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
              <ul className="space-y-2">
                {['Voice Consultant', 'Document Analyzer', 'Know Your Rights', 'Draft Generator'].map((item, i) => (
                  <li key={i}>
                    <Link to={['dashboard', 'document-analyzer', 'know-your-rights', 'draft-generator'][i]} className="text-[#94a3b8] text-sm hover:text-amber-400 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                {['Case Rescue Plan', 'Case Tracker', 'Indian Constitution', 'Legal Resources'].map((item, i) => (
                  <li key={i}>
                    <span className="text-[#94a3b8] text-sm hover:text-amber-400 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Contact Us'].map((item, i) => (
                  <li key={i}>
                    <span className="text-[#94a3b8] text-sm hover:text-amber-400 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#94a3b8] text-sm">
              © 2026 Lex AI. All rights reserved.
            </p>
            <p className="text-amber-400/60 text-xs flex items-center gap-1">
              ⚠️ Not a substitute for professional legal advice. Always consult a qualified lawyer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
