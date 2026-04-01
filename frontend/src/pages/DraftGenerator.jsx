import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { IoCreate, IoDownload } from 'react-icons/io5';
import { FiFileText } from 'react-icons/fi';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const DEMO_USER = 'demo-user-001';

const draftTypes = [
  { value: 'RTI Application', label: 'RTI Application', desc: 'Right to Information Act 2005', icon: '📝' },
  { value: 'FIR Complaint', label: 'FIR Complaint', desc: 'For filing at police station', icon: '🚔' },
  { value: 'Rent Agreement', label: 'Rent Agreement', desc: 'Landlord-tenant agreement', icon: '🏠' },
  { value: 'Legal Notice', label: 'Legal Notice', desc: 'Under Section 80 CPC', icon: '⚖️' },
  { value: 'Cease and Desist', label: 'Cease & Desist', desc: 'Stop illegal activity', icon: '🛑' },
  { value: 'Consumer Complaint', label: 'Consumer Complaint', desc: 'Consumer Protection Act', icon: '🛒' },
];

const formFields = {
  'RTI Application': ['applicant_name', 'address', 'public_authority', 'information_sought', 'time_period'],
  'FIR Complaint': ['complainant_name', 'address', 'incident_date', 'incident_location', 'incident_details', 'accused_details'],
  'Rent Agreement': ['landlord_name', 'tenant_name', 'property_address', 'rent_amount', 'security_deposit', 'agreement_duration', 'start_date'],
  'Legal Notice': ['sender_name', 'sender_address', 'recipient_name', 'recipient_address', 'subject', 'facts', 'demand'],
  'Cease and Desist': ['sender_name', 'recipient_name', 'illegal_activity', 'details', 'deadline'],
  'Consumer Complaint': ['complainant_name', 'product_service', 'company_name', 'purchase_date', 'complaint_details', 'relief_sought'],
};

export default function DraftGenerator() {
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateDraft = async () => {
    if (!selectedType) return;
    setLoading(true);
    setError('');
    setDraft(null);

    try {
      const res = await axios.post(`${API}/api/draft`, {
        user_id: DEMO_USER,
        draft_type: selectedType,
        details: formData,
      });
      setDraft(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Draft generation failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!draft?.draft_id) return;
    window.open(`${API}/api/draft/download/${draft.draft_id}`, '_blank');
  };

  const fields = selectedType ? formFields[selectedType] || [] : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
          <IoCreate className="w-8 h-8 text-white" />
        </div>
        <h1 className="section-title mb-3">Draft Generator</h1>
        <p className="text-[#94a3b8]">Generate professional legal drafts ready for Indian courts</p>
      </motion.div>

      {/* Draft Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6 mb-8"
      >
        <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Select Draft Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {draftTypes.map((dt) => (
            <button
              key={dt.value}
              onClick={() => { setSelectedType(dt.value); setFormData({}); setDraft(null); }}
              className={`p-4 rounded-xl text-left transition-all duration-300 border
                ${selectedType === dt.value
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                }
              `}
            >
              <span className="text-2xl">{dt.icon}</span>
              <p className="text-white font-medium text-sm mt-2">{dt.label}</p>
              <p className="text-[#94a3b8] text-xs mt-0.5">{dt.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6 mb-8"
        >
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
            Fill in Details for {selectedType}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field} className={field.includes('details') || field.includes('facts') || field.includes('information') ? 'md:col-span-2' : ''}>
                <label className="block text-[#94a3b8] text-xs mb-1.5 capitalize">
                  {field.replace(/_/g, ' ')}
                </label>
                {(field.includes('details') || field.includes('facts') || field.includes('information')) ? (
                  <textarea
                    rows={4}
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="input-gold resize-none"
                    placeholder={`Enter ${field.replace(/_/g, ' ')}...`}
                  />
                ) : (
                  <input
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="input-gold"
                    placeholder={`Enter ${field.replace(/_/g, ' ')}...`}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={generateDraft}
            disabled={loading}
            className="btn-gold mt-6 w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FiFileText className="w-5 h-5" /> Generate Draft
              </span>
            )}
          </button>
          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
        </motion.div>
      )}

      {/* Draft Preview */}
      {draft && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[rgba(20,24,36,0.6)] backdrop-blur-xl border border-[rgba(245,158,11,0.15)] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <FiFileText className="text-amber-400" /> Generated Draft
            </h3>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20
                hover:bg-green-500/20 transition-all duration-300 text-sm font-medium active:scale-[0.97]"
            >
              <IoDownload className="w-4 h-4" /> Download PDF
            </button>
          </div>
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {draft.content}
          </div>
        </motion.div>
      )}
    </div>
  );
}
