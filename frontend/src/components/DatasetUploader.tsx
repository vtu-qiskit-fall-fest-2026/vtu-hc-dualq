import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface DatasetUploaderProps {
  onFileUploaded: (fileName: string, rowCount: number) => void;
}

export const DatasetUploader: React.FC<DatasetUploaderProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const isCsv = file.name.endsWith('.csv');
    if (!isCsv) {
      alert("Please select a standard .csv transaction dataset.");
      return;
    }

    // Client-side demonstration handling
    setUploadSuccess(file.name);
    onFileUploaded(file.name, Math.floor(file.size / 60) + 120);

    setTimeout(() => {
      setUploadSuccess(null);
    }, 4500);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? 'var(--color-blue)' : 'var(--color-border)'}`,
        borderRadius: 'var(--card-radius)',
        backgroundColor: isDragging ? 'var(--color-blue-subtle)' : '#FFFFFF',
        padding: '36px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-blue)',
          margin: '0 auto 12px'
        }}
      >
        <UploadCloud size={24} />
      </div>

      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
        Upload Transaction Dataset (CSV)
      </h3>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
        Drag and drop your credit card transaction dataset here, or browse from your local file system. 
        Supports standard Kaggle fraud schema (`Time`, `V1-V28`, `Amount`, `Class`).
      </p>

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <FileSpreadsheet size={14} />
        <span>Browse Files</span>
      </button>

      {uploadSuccess && (
        <div 
          style={{ 
            marginTop: '16px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: 'var(--color-green-subtle)', 
            border: '1px solid rgba(38, 115, 77, 0.25)', 
            padding: '6px 14px', 
            borderRadius: '4px',
            fontSize: '12px',
            color: 'var(--color-green)'
          }}
        >
          <CheckCircle2 size={15} />
          <span>Successfully parsed <strong>{uploadSuccess}</strong> for client simulation!</span>
        </div>
      )}
    </div>
  );
};
