import React, { useCallback, useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

export default function DocumentUpload({ onFileSelect, accept = '.pdf,.docx', maxSizeMB = 10 }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    setError('');
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Only PDF and DOCX files are supported');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  }, [onFileSelect, maxSizeMB]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
          ${dragOver
            ? 'border-amber-500 bg-amber-500/[0.06] scale-[1.01]'
            : 'border-[rgba(245,158,11,0.25)] hover:border-amber-500/50 hover:bg-white/[0.02]'
          }
          ${selectedFile ? 'border-green-500/40 bg-green-500/[0.04]' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${selectedFile.name.endsWith('.pdf') ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'}`}>
              <FiFile className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-[#94a3b8] text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="ml-4 p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <FiX className="w-5 h-5 text-white/50" />
            </button>
          </div>
        ) : (
          <>
            <FiUploadCloud className={`w-12 h-12 mx-auto mb-3 transition-all duration-300
              ${dragOver ? 'text-amber-400 scale-110' : 'text-amber-500/40'}`}
            />
            <p className="text-white/60 font-medium">
              Drag & drop your document here
            </p>
            <p className="text-[#94a3b8] text-sm mt-1">
              or click to browse • PDF, DOCX • Max {maxSizeMB}MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 text-red-400 text-sm animate-shake">{error}</p>
      )}
    </div>
  );
}
