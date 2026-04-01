import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';
import { FiSearch, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const DEMO_USER = 'demo-user-001';

const riskColors = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: <FiAlertTriangle /> },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: <FiInfo /> },
  low: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: <FiCheckCircle /> },
};

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [docId, setDocId] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [queryAnswer, setQueryAnswer] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeDocument = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', DEMO_USER);

    try {
      const res = await axios.post(`${API}/api/document/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(res.data.analysis);
      setDocId(res.data.document_id);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const queryDocument = async () => {
    if (!queryInput.trim() || !docId) return;
    setQueryLoading(true);
    try {
      const res = await axios.post(`${API}/api/document/query`, {
        document_id: docId,
        question: queryInput,
        user_id: DEMO_USER,
      });
      setQueryAnswer(res.data.answer);
    } catch {
      setQueryAnswer('Query failed. Please try again.');
    } finally {
      setQueryLoading(false);
    }
  };

  const risk = analysis ? riskColors[analysis.risk_level] || riskColors.low : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg">
          <FiSearch className="w-8 h-8 text-white" />
        </div>
        <h1 className="section-title mb-3">Document Analyzer</h1>
        <p className="text-[#94a3b8]">Upload a legal document to identify risky clauses and get AI analysis</p>
      </motion.div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-8 mb-8"
      >
        <DocumentUpload onFileSelect={setFile} />

        <button
          onClick={analyzeDocument}
          disabled={!file || loading}
          className="btn-gold mt-6 w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze Document'
          )}
        </button>
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </motion.div>

      {/* Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Risk Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl p-6 ${risk.bg} ${risk.border} border`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-2xl ${risk.text}`}>{risk.icon}</span>
              <h3 className={`text-xl font-bold ${risk.text} uppercase`}>{analysis.risk_level} Risk</h3>
            </div>
            <p className="text-white/60 text-sm">{analysis.plain_explanation}</p>
          </motion.div>

          {/* Risky Clauses */}
          {analysis.risky_clauses?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <FiAlertTriangle className="text-red-400" /> Flagged Clauses
              </h3>
              <ul className="space-y-3">
                {analysis.risky_clauses.map((clause, i) => (
                  <li key={i} className="flex gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <span className="text-white/70 text-sm">{clause}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <FiCheckCircle className="text-green-400" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span className="text-white/70 text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Query */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <FiSearch className="text-amber-400" /> Ask About This Document
            </h3>
            <div className="flex gap-3">
              <input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && queryDocument()}
                placeholder="e.g. What are the termination conditions?"
                className="input-gold flex-1"
              />
              <button
                onClick={queryDocument}
                disabled={queryLoading || !queryInput.trim()}
                className="btn-gold px-5 disabled:opacity-40"
              >
                {queryLoading ? '...' : <FiSearch className="w-5 h-5" />}
              </button>
            </div>
            {queryAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 text-sm leading-relaxed"
              >
                {queryAnswer}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
