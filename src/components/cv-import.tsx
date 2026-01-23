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

    const extractTextFromFile = async (file: File): Promise<string> => {
        // For PDF files, we'll read as text (basic extraction)
        // For production, you would use pdf.js or a server-side parser
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            // Read PDF as ArrayBuffer and extract text
            const arrayBuffer = await file.arrayBuffer();
            const text = await extractTextFromPDF(arrayBuffer);
            return text;
        } else {
            // For DOCX, read as text
            const text = await file.text();
            return text;
        }
    };

    const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        // Basic PDF text extraction - looks for text streams
        const bytes = new Uint8Array(arrayBuffer);
        let text = '';

        // Decode as text to find readable content
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(bytes);

        // Extract text between BT and ET markers (PDF text blocks)
        const matches = rawText.match(/\(([^)]+)\)/g);
        if (matches) {
            text = matches.map(m => m.slice(1, -1)).join(' ');
        }

        // Also look for plain text content
        const plainMatches = rawText.match(/\/T[jJ]\s*\[(.*?)\]/g);
        if (plainMatches) {
            text += ' ' + plainMatches.join(' ');
        }

        // Fallback - try to find readable strings
        if (!text.trim()) {
            text = rawText
                .replace(/[^\x20-\x7E\n]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        return text;
    };

    const parseResumeWithAI = async (text: string): Promise<ResumeData> => {
        try {
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to parse resume');
            }

            const data = await response.json();
            return data.resume;
        } catch (error) {
            console.error('AI parsing failed:', error);
            // Fallback to basic parsing
            return parseResumeBasic(text);
        }
    };

    const parseResumeBasic = (text: string): ResumeData => {
        // Basic regex-based parsing as fallback
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/);
        const nameMatch = text.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/m);

        return {
            personalInfo: {
                firstName: nameMatch ? nameMatch[1].split(' ')[0] : '',
                lastName: nameMatch ? nameMatch[1].split(' ')[1] : '',
                email: emailMatch ? emailMatch[0] : '',
                phone: phoneMatch ? phoneMatch[0] : '',
                summary: text.substring(0, 500), // First 500 chars as summary
            },
            experience: [],
            education: [],
            skills: [],
            languages: [],
            certificates: [],
        };
    };

    const handleImport = async () => {
        if (!file) return;

        setStatus('parsing');
        setErrorMessage('');

        try {
            const text = await extractTextFromFile(file);
            const resumeData = await parseResumeWithAI(text);

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
            setErrorMessage('Failed to parse the resume. Please try again or enter your information manually.');
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
