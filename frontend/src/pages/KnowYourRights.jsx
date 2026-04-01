import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { IoShieldCheckmark } from 'react-icons/io5';
import { FiSend, FiSearch } from 'react-icons/fi';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const quickQuestions = [
  'Can police arrest me without a warrant?',
  'How do I file an FIR if police refuse?',
  'What are my rights during arrest?',
  'How to file an RTI application?',
  'What is bail and how to get it?',
  'Consumer complaint process in India',
  'Tenant rights under Indian law',
  "Women's rights under domestic violence act",
];

export default function KnowYourRights() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askRights = async (q) => {
    const text = q || question;
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    setQuestion(text);

    try {
      const res = await axios.post(`${API}/api/rights`, { question: text });
      setAnswer(res.data.answer);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 mb-6 shadow-lg">
          <IoShieldCheckmark className="w-8 h-8 text-white" />
        </div>
        <h1 className="section-title mb-3">Know Your Rights</h1>
        <p className="text-[#94a3b8]">Learn about your constitutional & legal rights under Indian law</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6 mb-8"
      >
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/50 w-5 h-5" />
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askRights()}
            placeholder="Ask anything about Indian law..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1]
              text-white text-lg placeholder-white/30
              focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20
              transition-all duration-300"
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => askRights()}
            disabled={loading || !question.trim()}
            className="btn-gold px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2"><FiSend className="w-4 h-4" /> Ask</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Quick Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3">Common Questions</h3>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => askRights(q)}
              className="px-4 py-2 rounded-xl text-sm text-[#94a3b8] border border-[rgba(245,158,11,0.12)] bg-white/[0.02]
                hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
            >
              {q}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl p-6 border border-red-500/20 bg-red-500/5 mb-6"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Answer */}
      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <IoShieldCheckmark className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Your Rights</h3>
          </div>
          <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pl-9">
            {answer}
          </div>
        </motion.div>
      )}
    </div>
  );
}
