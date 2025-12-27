'use client';

import React, { useState, useRef, Dispatch, SetStateAction } from 'react';
import { UploadCloud, X, FileText } from 'lucide-react';

export default function FileUpload({
    files,
    setFiles,
}: {
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
}) {
    const [isDragging, setIsDragging] = useState(false);
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
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className='w-full max-w-xl mx-auto p-6'>
            {/* Dropzone Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-xl p-12
          transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center gap-4
          ${
              isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-slate-300 hover:border-slate-400 dark:border-slate-700'
          }
        `}
            >
                <input
                    type='file'
                    accept='image/*,video/*'
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className='hidden'
                    multiple
                />

                <div className='p-4 bg-slate-100 dark:bg-slate-800 rounded-full'>
                    <UploadCloud
                        className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-slate-500'}`}
                    />
                </div>

                <div className='text-center'>
                    <p className='text-sm font-medium'>
                        <span className='text-blue-600 dark:text-blue-400'>Click to upload</span> or
                        drag and drop
                    </p>
                    <p className='text-xs text-slate-500 mt-1'>PDF, PNG, JPG (max. 10MB)</p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className='mt-6 space-y-3'>
                    <p className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                        Uploaded Files ({files.length})
                    </p>
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className='flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg'
                        >
                            <div className='flex items-center gap-3'>
                                <FileText className='w-5 h-5 text-blue-500' />
                                <div>
                                    <p className='text-sm font-medium truncate max-w-[200px]'>
                                        {file.name}
                                    </p>
                                    <p className='text-[10px] text-slate-500'>
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                className='p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded'
                            >
                                <X className='w-4 h-4 text-slate-400' />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
