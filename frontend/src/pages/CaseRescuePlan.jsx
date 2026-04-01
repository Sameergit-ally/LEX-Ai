import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiDownload, FiSave, FiClock, FiFileText, FiPhoneCall, FiChevronRight } from 'react-icons/fi';
import { IoScale } from 'react-icons/io5';
import axios from 'axios';
import VoiceLawyer from '../components/VoiceLawyer';
import Badge from '../components/ui/Badge';
import { supabase } from '../lib/supabaseClient';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const DEMO_USER = 'demo-user-001';

const QUICK_TAGS = [
  { label: 'Property Dispute', icon: '🏠' },
  { label: 'Workplace Harassment', icon: '💼' },
  { label: 'Consumer Fraud', icon: '🛒' },
  { label: 'Police Complaint', icon: '🚔' },
];

const TEMPLATES = {
  'Property Dispute': 'My landlord is not returning my security deposit of Rs 50,000 since 6 months despite multiple requests and serving a 1-month notice.',
  'Workplace Harassment': 'My employer has not paid my salary for the last 3 months and is threatening to terminate me if I complain.',
  'Consumer Fraud': 'I ordered a laptop online but received a fake product. The e-commerce company is refusing a refund.',
  'Police Complaint': 'My neighbor has been regularly creating public nuisance late at night and threatening my family when asked to stop.',
};

const LOADING_TEXTS = [
  "Analyzing your situation...",
  "Consulting Indian Constitution...",
  "Identifying relevant IPC sections...",
  "Building your personalized roadmap...",
];

export default function CaseRescuePlan() {
  const [stage, setStage] = useState(1);
  const [problemText, setProblemText] = useState('');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [planData, setPlanData] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (stage === 2) {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleQuickTag = (tag) => {
    setProblemText(TEMPLATES[tag] || tag);
  };

  const handleGeneratePlan = async () => {
    if (!problemText.trim()) return;
    setErrorText('');
    setStage(2);
    setLoadingTextIndex(0);
    const startTime = Date.now();

    try {
      const res = await axios.post(`${API}/api/rescue/generate`, {
        user_id: DEMO_USER,
        problem_description: problemText,
      });

      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 2000) {
        await new Promise((r) => setTimeout(r, 2000 - elapsedTime));
      }

      const plan = res.data;
      if (!plan || !plan.severity) throw new Error('Invalid response format from AI');
      setPlanData(plan);
      setStage(3);
    } catch (err) {
      console.error(err);
      setErrorText(err.response?.data?.detail || 'Failed to generate plan. Please try again.');
      setStage(1);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setProblemText((prev) => (prev ? prev + ' ' + transcript : transcript));
  };

  const handleStepToggle = (stepNum) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  const handleSavePlan = async () => {
    try {
      const { error } = await supabase.from('rescue_plans').insert([
        {
          user_id: DEMO_USER,
          problem_description: problemText,
          case_category: planData?.case_type || 'General',
          plan: planData,
          severity: planData?.severity,
        },
      ]);
      if (error) throw error;
      alert('Plan saved successfully to Supabase!');
    } catch (err) {
      console.error(err);
      alert('Failed to save plan: ' + err.message);
    }
  };

  const progressPercentage =
    planData && planData.roadmap_steps
      ? Math.round((completedSteps.length / planData.roadmap_steps.length) * 100)
      : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Case Rescue Plan
          </h1>
          <p className="text-[#94a3b8] text-lg">Your personalized legal roadmap backed by the Constitution.</p>
        </motion.div>

        {errorText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-red-500/50 bg-red-500/10 text-red-200 animate-shake"
          >
            {errorText}
          </motion.div>
        )}

        {/* STAGE 1: Input */}
        {stage === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-500/30 bg-[rgba(20,24,36,0.6)] backdrop-blur-xl p-6 md:p-10 shadow-glow"
          >
            <h2
              className="text-2xl font-semibold mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Describe Your Problem
            </h2>

            <div className="relative">
              <textarea
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Describe your situation in detail... e.g. My landlord is not returning my security deposit since 6 months despite multiple requests."
                className="w-full h-40 bg-white/[0.04] border border-white/[0.1] rounded-xl p-4 text-white placeholder-white/30
                  focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
                maxLength={2000}
              />
              <span className="absolute bottom-4 right-4 text-white/20 text-xs">
                {problemText.length}/2000
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <div className="scale-50 origin-left -my-6">
                <VoiceLawyer onTranscript={handleVoiceTranscript} />
              </div>
              <span className="text-white/30 text-xs">Or use voice to describe your problem</span>
            </div>

            <div className="mt-6">
              <p className="text-sm text-white/50 mb-3">Quick Select:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleQuickTag(tag.label)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/20 bg-white/5
                      hover:bg-amber-500/15 hover:border-amber-500/40 hover:text-amber-400
                      transition-all duration-300"
                  >
                    <span>{tag.icon}</span> {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={!problemText.trim()}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg
                hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <IoScale className="w-5 h-5" /> Generate My Rescue Plan
            </button>
          </motion.div>
        )}

        {/* STAGE 2: Loading */}
        {stage === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-md">
            <div className="flex flex-col items-center text-center max-w-md px-6">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full border-4 border-amber-500/30 flex items-center justify-center mb-8 relative"
              >
                <div className="absolute inset-0 rounded-full border-t-4 border-amber-500 animate-spin" />
                <IoScale className="w-10 h-10 text-amber-500" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl text-white font-semibold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {LOADING_TEXTS[loadingTextIndex]}
                </motion.p>
              </AnimatePresence>

              {/* Fake progress bar */}
              <div className="w-64 h-1.5 rounded-full bg-white/[0.06] mt-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: Output */}
        {stage === 3 && planData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Progress Bar */}
            <div className="sticky top-20 z-40 bg-[#0a0a0f]/90 backdrop-blur pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex justify-between text-sm mb-2 text-amber-400 font-semibold">
                <span>Plan Completion</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-white/[0.06] h-2.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-[rgba(245,158,11,0.2)] bg-[rgba(20,24,36,0.6)] backdrop-blur-xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <Badge
                  variant={planData.severity.toLowerCase()}
                  pulse={planData.severity.toLowerCase() === 'high'}
                >
                  {planData.severity} SEVERITY
                </Badge>
              </div>
              <h3 className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-2">Case Type</h3>
              <p className="text-2xl text-white font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {planData.case_type}
              </p>

              <div className="flex items-center gap-3 bg-white/[0.04] p-4 rounded-xl mb-6 border border-white/[0.06]">
                <FiClock className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="text-xs text-[#94a3b8] uppercase">Estimated Time</p>
                  <p className="font-semibold text-white">{planData.estimated_resolution}</p>
                </div>
              </div>

              <div className="bg-white/[0.04] p-4 rounded-xl border-l-4 border-amber-500">
                <p className="text-lg leading-relaxed text-white/90">{planData.summary}</p>
              </div>
            </motion.div>

            {/* Rights Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="text-3xl font-bold mb-6 text-white border-b border-white/[0.08] pb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your Constitutional Rights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planData.constitutional_rights.map((right, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="bg-[rgba(20,24,36,0.5)] border border-[rgba(245,158,11,0.15)] rounded-xl p-6
                      hover:border-amber-500/40 transition-all duration-300"
                  >
                    <h4 className="text-amber-400 font-bold text-xl mb-1">{right.article}</h4>
                    <p className="text-lg font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {right.title}
                    </p>
                    <p className="text-[#94a3b8] text-sm mb-4 leading-relaxed">{right.simple_meaning}</p>
                    <div className="bg-white/[0.04] p-3 rounded-lg border border-white/[0.06]">
                      <p className="text-xs text-amber-400/60 uppercase mb-1">How it applies:</p>
                      <p className="text-sm text-white/90">{right.applies_to_case}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2
                className="text-3xl font-bold mb-8 text-white border-b border-white/[0.08] pb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Action Plan & Roadmap
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[2.25rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:to-transparent">
                {planData.roadmap_steps.map((step, idx) => {
                  const isCompleted = completedSteps.includes(step.step_number);
                  return (
                    <motion.div
                      key={step.step_number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="relative flex items-start gap-4 md:gap-8"
                    >
                      <button
                        onClick={() => handleStepToggle(step.step_number)}
                        className={`relative z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 border-[#0a0a0f] shadow-sm flex-shrink-0 transition-all cursor-pointer hover:scale-110
                          ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}
                      >
                        {isCompleted ? (
                          <FiCheck className="w-5 h-5 md:w-7 md:h-7 text-black" />
                        ) : (
                          <span className="font-bold text-black md:text-lg">{step.step_number}</span>
                        )}
                      </button>

                      <div
                        className={`flex-1 rounded-2xl border bg-[rgba(20,24,36,0.5)] p-5 md:p-6 transition-all duration-300
                        ${isCompleted
                          ? 'border-green-500/30 opacity-60'
                          : 'border-[rgba(245,158,11,0.15)] hover:border-amber-500/40 shadow-lg'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                          <h3
                            className={`text-xl font-bold ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {step.action}
                          </h3>
                          <span className="text-xs px-3 py-1 bg-white/[0.06] rounded-full text-[#94a3b8] whitespace-nowrap">
                            Time: {step.estimated_time}
                          </span>
                        </div>
                        <p className="text-[#94a3b8] leading-relaxed mb-4">{step.description}</p>

                        {step.documents_needed && step.documents_needed.length > 0 && (
                          <div className="bg-white/[0.04] p-4 rounded-xl border border-white/[0.06]">
                            <h5 className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-2">
                              <FiFileText className="text-amber-400" /> Required Documents
                            </h5>
                            <ul className="list-disc list-inside text-sm text-[#94a3b8] space-y-1">
                              {step.documents_needed.map((doc, dIdx) => (
                                <li key={dIdx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Warnings */}
            {planData.warnings && planData.warnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 md:p-8"
              >
                <h3
                  className="flex items-center gap-2 text-2xl font-bold text-red-400 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <FiAlertCircle className="w-6 h-6" /> Critical Warnings
                </h3>
                <ul className="space-y-3">
                  {planData.warnings.map((warning, idx) => (
                    <li key={idx} className="flex gap-3 text-red-200/80">
                      <FiChevronRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Legal Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2
                className="text-2xl font-bold mb-6 text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Help & Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planData.legal_resources.map((resource, idx) => (
                  <div
                    key={idx}
                    className="bg-[rgba(20,24,36,0.5)] border border-[rgba(245,158,11,0.15)] rounded-xl p-5
                      hover:border-amber-500/40 transition-all duration-300"
                  >
                    <p className="text-xs text-amber-400 uppercase font-bold mb-1">{resource.type}</p>
                    <p className="text-lg text-white font-semibold mb-2">{resource.name}</p>
                    <p className="text-sm text-[#94a3b8] font-mono bg-white/[0.04] px-2 py-1 rounded inline-block">
                      {resource.contact}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/[0.08]">
              <button
                onClick={handleSavePlan}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/[0.05] border border-white/[0.15]
                  hover:bg-white/[0.1] transition-all text-white font-semibold active:scale-[0.97]"
              >
                <FiSave className="w-5 h-5" /> Save This Plan
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/[0.05] border border-white/[0.15]
                hover:bg-white/[0.1] transition-all text-white font-semibold active:scale-[0.97]">
                <FiDownload className="w-5 h-5" /> Download as PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600
                text-black hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all font-bold active:scale-[0.97]">
                <FiPhoneCall className="w-5 h-5" /> Talk to AI Lawyer
              </button>
            </div>

            <p className="text-center text-xs text-[#94a3b8]/50 pt-8 pb-4">
              Disclaimer: This AI-generated plan is for informational purposes only. Always consult a licensed advocate for final legal advice.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
