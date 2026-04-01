import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import VoiceLawyer from '../components/VoiceLawyer';
import { FiSend, FiUser, FiCpu, FiFileText, FiShield, FiEdit3, FiBarChart2, FiAlertTriangle, FiMic } from 'react-icons/fi';
import { IoScale } from 'react-icons/io5';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const DEMO_USER = 'demo-user-001';

const quickActions = [
  { icon: <FiMic />, title: 'Voice Consultant', desc: 'Talk to AI Lawyer', link: '/dashboard', color: 'from-amber-500 to-orange-500' },
  { icon: <FiFileText />, title: 'Analyze Document', desc: 'Check for risky clauses', link: '/document-analyzer', color: 'from-blue-500 to-cyan-500' },
  { icon: <FiShield />, title: 'Know Your Rights', desc: 'Learn Indian law', link: '/know-your-rights', color: 'from-emerald-500 to-green-500' },
  { icon: <FiEdit3 />, title: 'Draft Generator', desc: 'RTI, FIR, Notices', link: '/draft-generator', color: 'from-purple-500 to-pink-500' },
  { icon: <FiAlertTriangle />, title: 'Case Rescue', desc: 'Get rescue plan', link: '/case-rescue', color: 'from-red-500 to-rose-500' },
  { icon: <FiBarChart2 />, title: 'Case Tracker', desc: 'Track your cases', link: '/case-tracker', color: 'from-indigo-500 to-violet-500' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateString() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', message: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/chat`, {
        user_id: DEMO_USER,
        message: text,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', message: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', message: '⚠️ Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    if (transcript.trim()) {
      sendMessage(transcript);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          {getGreeting()}, User ⚖️
        </h1>
        <p className="text-[#94a3b8]">{getDateString()}</p>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <IoScale />, num: '12', label: 'Cases Saved', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: <FiFileText />, num: '8', label: 'Docs Analyzed', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: <FiEdit3 />, num: '5', label: 'Drafts Generated', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { icon: <FiShield />, num: '24', label: 'Rights Learned', color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)]"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <span className={`text-lg ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.num}</p>
            <p className="text-[#94a3b8] text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Case Rescue CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-[#141824] border border-amber-500/30 p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 opacity-10">
          <IoScale className="w-40 h-40 text-amber-500" />
        </div>
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Urgent</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Got a Legal Problem?
          </h2>
          <p className="text-amber-400/80 font-medium text-sm">Get AI-powered rescue plan with Constitutional backing</p>
        </div>
        <Link
          to="/case-rescue"
          className="relative z-10 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold
            hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 whitespace-nowrap"
        >
          Get My Rescue Plan →
        </Link>
      </motion.div>

      {/* ── Quick Actions ── */}
      <div className="mb-8">
        <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <Link
                to={action.link}
                className="block p-4 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl
                  border border-[rgba(245,158,11,0.12)] 
                  hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]
                  hover:border-[rgba(245,158,11,0.3)]
                  transition-all duration-300 group text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 
                  group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-lg">{action.icon}</span>
                </div>
                <p className="text-white text-sm font-medium">{action.title}</p>
                <p className="text-[#94a3b8] text-xs mt-0.5">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Chat Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] 
            flex flex-col items-center justify-center"
        >
          <h3 className="text-[#94a3b8] text-sm font-medium uppercase tracking-wider mb-6">Voice Mode</h3>
          <VoiceLawyer onTranscript={handleVoiceTranscript} />
          <p className="text-white/20 text-xs mt-6 text-center">
            Uses Vapi AI for voice recognition
          </p>
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] 
            flex flex-col overflow-hidden"
          style={{ height: '500px' }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <IoScale className="w-16 h-16 mb-4 text-amber-500/30" />
                <p className="text-white/40 text-lg font-medium">Start a conversation</p>
                <p className="text-white/20 text-sm mt-1">Ask about your legal rights, FIR procedures, bail, RTI, and more</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiCpu className="w-4 h-4 text-black" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-br-md font-medium'
                      : 'bg-white/[0.06] text-white/80 rounded-bl-md border border-white/[0.06]'
                    }`}
                >
                  {msg.message}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiUser className="w-4 h-4 text-white/60" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <FiCpu className="w-4 h-4 text-black" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-amber-400/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-amber-400/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-amber-400/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type your legal question..."
                className="input-gold flex-1"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="btn-gold px-5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
