import React, { useState, useEffect, useRef } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

export default function VoiceLawyer({ onTranscript }) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('idle');
  const vapiRef = useRef(null);

  useEffect(() => {
    const loadVapi = async () => {
      try {
        const { default: Vapi } = await import('@vapi-ai/web');
        const apiKey = process.env.REACT_APP_VAPI_API_KEY;
        if (apiKey) {
          vapiRef.current = new Vapi(apiKey);
          vapiRef.current.on('speech-start', () => setStatus('active'));
          vapiRef.current.on('speech-end', () => setStatus('active'));
          vapiRef.current.on('call-start', () => { setStatus('active'); setIsActive(true); });
          vapiRef.current.on('call-end', () => { setStatus('idle'); setIsActive(false); });
          vapiRef.current.on('message', (msg) => {
            if (msg.type === 'transcript' && msg.transcriptType === 'final' && onTranscript) {
              onTranscript(msg.transcript);
            }
          });
          vapiRef.current.on('error', () => setStatus('error'));
        }
      } catch (err) {
        console.warn('Vapi SDK not available:', err);
      }
    };
    loadVapi();

    return () => {
      if (vapiRef.current) {
        try { vapiRef.current.stop(); } catch {}
      }
    };
  }, [onTranscript]);

  const toggleVoice = async () => {
    if (!vapiRef.current) {
      setStatus('error');
      return;
    }

    if (isActive) {
      vapiRef.current.stop();
      setIsActive(false);
      setStatus('idle');
    } else {
      setStatus('connecting');
      try {
        const assistantId = process.env.REACT_APP_VAPI_ASSISTANT_ID || '';
        await vapiRef.current.start(assistantId);
      } catch (err) {
        console.error('Vapi start error:', err);
        setStatus('error');
      }
    }
  };

  const statusText = {
    idle: 'Tap to speak with AI Lawyer',
    connecting: 'Connecting...',
    active: 'Listening... Speak now',
    error: 'Voice unavailable',
  };

  const statusColor = {
    idle: 'from-amber-500 to-amber-600',
    connecting: 'from-yellow-500 to-orange-500',
    active: 'from-green-500 to-emerald-400',
    error: 'from-red-500 to-red-600',
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Voice Orb */}
      <button
        onClick={toggleVoice}
        className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${statusColor[status]}
          flex items-center justify-center
          transition-all duration-500 ease-out
          ${isActive ? 'voice-orb-active scale-110' : 'hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]'}
        `}
      >
        {/* Rings */}
        {isActive && (
          <>
            <span className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '2s' }} />
            <span className="absolute -inset-3 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s' }} />
            <span className="absolute -inset-6 rounded-full border border-white/5 animate-ping" style={{ animationDuration: '4s' }} />
          </>
        )}
        {isActive
          ? <FiMicOff className="w-10 h-10 text-white relative z-10" />
          : <FiMic className="w-10 h-10 text-white relative z-10" />
        }
      </button>

      {/* Status text */}
      <p className={`text-sm font-medium transition-all duration-300
        ${status === 'active' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-[#94a3b8]'}
      `}>
        {statusText[status]}
      </p>
    </div>
  );
}
