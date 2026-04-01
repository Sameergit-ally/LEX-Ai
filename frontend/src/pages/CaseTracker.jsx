import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { IoSearch, IoCalendar, IoAdd, IoChevronForward } from 'react-icons/io5';
import { FiClock, FiMapPin, FiHash, FiCpu } from 'react-icons/fi';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const DEMO_USER = 'demo-user-001';

export default function CaseTracker() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ case_number: '', court_name: '', case_type: '' });
  const [hearingDate, setHearingDate] = useState('');
  const [hearingDesc, setHearingDesc] = useState('');
  const [hearingDates, setHearingDates] = useState([]);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/case/user/${DEMO_USER}`);
      setCases(res.data.cases || []);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const addCase = async () => {
    if (!form.case_number.trim() || !form.court_name.trim()) return;
    setAddLoading(true);
    try {
      const res = await axios.post(`${API}/api/case`, {
        user_id: DEMO_USER,
        case_number: form.case_number,
        court_name: form.court_name,
        case_type: form.case_type,
        hearing_dates: hearingDates,
      });
      setCases((prev) => [res.data, ...prev]);
      setForm({ case_number: '', court_name: '', case_type: '' });
      setHearingDates([]);
      setShowAdd(false);
    } catch {} finally {
      setAddLoading(false);
    }
  };

  const addHearing = () => {
    if (!hearingDate) return;
    setHearingDates((prev) => [...prev, { date: hearingDate, description: hearingDesc, completed: false }]);
    setHearingDate('');
    setHearingDesc('');
  };

  const viewCase = async (id) => {
    try {
      const res = await axios.get(`${API}/api/case/${id}`);
      setSelectedCase(res.data);
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mb-6 shadow-lg">
          <IoSearch className="w-8 h-8 text-white" />
        </div>
        <h1 className="section-title mb-3">Case Tracker</h1>
        <p className="text-[#94a3b8]">Track your court cases, hearing dates & get AI-powered next steps</p>
      </motion.div>

      {/* Add Case Button */}
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold flex items-center gap-2">
          <IoAdd className="w-5 h-5" /> Add Case
        </button>
      </div>

      {/* Add Case Form */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Add New Case</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1.5">Case Number</label>
              <input
                value={form.case_number}
                onChange={(e) => setForm({ ...form, case_number: e.target.value })}
                className="input-gold"
                placeholder="e.g. CRL.A/1234/2024"
              />
            </div>
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1.5">Court Name</label>
              <input
                value={form.court_name}
                onChange={(e) => setForm({ ...form, court_name: e.target.value })}
                className="input-gold"
                placeholder="e.g. Delhi High Court"
              />
            </div>
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1.5">Case Type</label>
              <input
                value={form.case_type}
                onChange={(e) => setForm({ ...form, case_type: e.target.value })}
                className="input-gold"
                placeholder="e.g. Criminal Appeal"
              />
            </div>
          </div>

          {/* Hearing Dates */}
          <div className="mb-4">
            <label className="block text-[#94a3b8] text-xs mb-1.5">Add Hearing Dates</label>
            <div className="flex gap-3 items-end">
              <input
                type="date"
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                className="input-gold flex-1"
              />
              <input
                value={hearingDesc}
                onChange={(e) => setHearingDesc(e.target.value)}
                className="input-gold flex-1"
                placeholder="Description (optional)"
              />
              <button onClick={addHearing} className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/60 transition-all border border-white/[0.1]">
                <IoAdd className="w-5 h-5" />
              </button>
            </div>
            {hearingDates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {hearingDates.map((hd, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    📅 {hd.date} {hd.description && `— ${hd.description}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={addCase}
            disabled={addLoading || !form.case_number.trim()}
            className="btn-gold w-full disabled:opacity-40"
          >
            {addLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Adding & Generating AI Steps...
              </span>
            ) : (
              'Add Case & Get AI Steps'
            )}
          </button>
        </motion.div>
      )}

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-[#94a3b8]">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="col-span-2 rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-12 text-center">
            <IoSearch className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-[#94a3b8]">No cases tracked yet. Add your first case above.</p>
          </div>
        ) : (
          cases.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => viewCase(c.id)}
              className={`rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border
                p-5 text-left w-full transition-all duration-300
                hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]
                ${selectedCase?.id === c.id ? 'border-amber-500/40' : 'border-[rgba(245,158,11,0.15)] hover:border-amber-500/30'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiHash className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-semibold text-sm">{c.case_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#94a3b8] text-xs mb-1">
                    <FiMapPin className="w-3 h-3" /> {c.court_name}
                  </div>
                  {c.case_type && (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white/[0.05] text-[#94a3b8] text-xs mt-1 border border-white/[0.06]">
                      {c.case_type}
                    </span>
                  )}
                </div>
                <IoChevronForward className="w-5 h-5 text-white/20" />
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Case Details */}
      {selectedCase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiHash className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedCase.case_number}</h3>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium border
              ${selectedCase.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-white/[0.06] text-white/40 border-white/[0.1]'}
            `}>
              {selectedCase.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[#94a3b8] text-xs mb-1">Court</p>
              <p className="text-white/80 text-sm font-medium">{selectedCase.court_name}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[#94a3b8] text-xs mb-1">Type</p>
              <p className="text-white/80 text-sm font-medium">{selectedCase.case_type || 'N/A'}</p>
            </div>
          </div>

          {selectedCase.hearing_dates?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white/50 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <IoCalendar className="w-4 h-4" /> Hearing Dates
              </h4>
              <div className="space-y-2">
                {selectedCase.hearing_dates.map((hd, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <FiClock className="w-4 h-4 text-amber-400" />
                    <span className="text-white/70 text-sm">{hd.date}</span>
                    {hd.description && <span className="text-[#94a3b8] text-sm">— {hd.description}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCase.ai_next_steps && (
            <div>
              <h4 className="text-white/50 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCpu className="w-4 h-4 text-blue-400" /> AI Recommended Next Steps
              </h4>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedCase.ai_next_steps}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
