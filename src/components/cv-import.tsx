'use client';

import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface CVImportProps {
    onImport: (data: ResumeData) => void;
}

export function CVImport({ onImport }: CVImportProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && isValidFileType(droppedFile)) {
            setFile(droppedFile);
            setStatus('idle');
            setErrorMessage('');
        } else {
            setErrorMessage('Please upload a PDF or DOCX file');
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && isValidFileType(selectedFile)) {
            setFile(selectedFile);
            setStatus('idle');
            setErrorMessage('');
        } else {
            setErrorMessage('Please upload a PDF or DOCX file');
        }
    }, []);

    const isValidFileType = (file: File): boolean => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.docx');
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const parseResumeWithAI = async (file: File): Promise<ResumeData> => {
        try {
            const base64Data = await fileToBase64(file);
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileData: base64Data,
                    mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to parse resume');
            }

            const data = await response.json();
            return data.resume;
        } catch (error) {
            console.error('AI parsing failed:', error);
            throw error;
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setStatus('parsing');
        setErrorMessage('');

        try {
            const resumeData = await parseResumeWithAI(file);
            setStatus('success');

            // Wait a moment to show success state
            setTimeout(() => {
                onImport(resumeData);
                setIsOpen(false);
                resetState();
            }, 1000);
        } catch (error) {
            console.error('Import error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to parse the resume. Please try again or enter your information manually.');
        }
    };

    const resetState = () => {
        setFile(null);
        setStatus('idle');
        setErrorMessage('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetState(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import CV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Import Your CV</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div
                        className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
              ${file ? 'border-green-500 bg-green-50' : ''}
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <FileText className="w-12 h-12 text-green-600" />
                                <p className="font-medium text-green-800">{file.name}</p>
                                <p className="text-sm text-green-600">Ready to import</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-12 h-12 text-gray-400" />
                                <p className="font-medium text-gray-700">Drop your CV here</p>
                                <p className="text-sm text-gray-500">or click to browse</p>
                                <p className="text-xs text-gray-400 mt-2">Supports PDF and DOCX files</p>
                            </div>
                        )}
                    </div>

                    {errorMessage && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => { setIsOpen(false); resetState(); }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={!file || status === 'parsing'}
                            className="gap-2"
                        >
                            {status === 'parsing' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {status === 'success' && <CheckCircle className="w-4 h-4" />}
                            {status === 'parsing' ? 'Parsing...' : status === 'success' ? 'Success!' : 'Import'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
