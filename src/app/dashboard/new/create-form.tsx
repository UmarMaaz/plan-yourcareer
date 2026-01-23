'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createResume, createResumeWithData } from './actions'
import { templates } from '@/lib/templates'
import { ChevronLeft, Rocket, Check, Upload, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TemplatePreview } from '@/components/resume-templates/TemplatePreview'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ResumeData } from '@/types/resume'

export function CreateResumeForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [selectedTemplate, setSelectedTemplate] = useState('mercury')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [importedData, setImportedData] = useState<ResumeData | null>(null)

    // CV Import state
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle')
    const [importError, setImportError] = useState('')

    const handleTemplateSelection = async (templateId: string) => {
        setSelectedTemplate(templateId)

        const title = titleInputRef.current?.value
        if (!title?.trim()) {
            titleInputRef.current?.focus()
            titleInputRef.current?.classList.add('ring-2', 'ring-purple-600', 'ring-offset-2', 'animate-pulse')
            setTimeout(() => {
                titleInputRef.current?.classList.remove('ring-2', 'ring-purple-600', 'ring-offset-2', 'animate-pulse')
            }, 1000)
            return
        }

        setIsSubmitting(true)

        if (importedData) {
            // Create resume with imported data
            const result = await createResumeWithData(title, templateId, importedData)
            if (result.resumeId) {
                router.push(`/dashboard/resumes/${result.resumeId}`)
            } else {
                setIsSubmitting(false)
                alert(result.error || 'Failed to create resume')
            }
        } else {
            // Create empty resume
            const formData = new FormData(formRef.current!)
            formData.set('template_id', templateId)
            await createResume(formData)
        }
    }

    // CV Import handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && isValidFileType(file)) {
            setImportFile(file)
            setImportStatus('idle')
            setImportError('')
        } else {
            setImportError('Please upload a PDF or DOCX file')
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && isValidFileType(file)) {
            setImportFile(file)
            setImportStatus('idle')
            setImportError('')
        } else {
            setImportError('Please upload a PDF or DOCX file')
        }
    }

    const isValidFileType = (file: File): boolean => {
        return file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.name.endsWith('.pdf') ||
            file.name.endsWith('.docx')
    }

    const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        const bytes = new Uint8Array(arrayBuffer)
        const decoder = new TextDecoder('utf-8', { fatal: false })
        const rawText = decoder.decode(bytes)

        const matches = rawText.match(/\(([^)]+)\)/g)
        let text = matches ? matches.map(m => m.slice(1, -1)).join(' ') : ''

        if (!text.trim()) {
            text = rawText.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim()
        }

        return text
    }

    const handleImport = async () => {
        if (!importFile) return

        setImportStatus('parsing')
        setImportError('')

        try {
            let text = ''

            if (importFile.type === 'application/pdf' || importFile.name.endsWith('.pdf')) {
                const arrayBuffer = await importFile.arrayBuffer()
                text = await extractTextFromPDF(arrayBuffer)
            } else {
                text = await importFile.text()
            }

            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            })

            if (!response.ok) throw new Error('Failed to parse resume')

            const data = await response.json()
            setImportedData(data.resume)
            setImportStatus('success')

            // Auto-set title if empty
            if (titleInputRef.current && !titleInputRef.current.value && data.resume.personalInfo) {
                const { firstName, lastName, jobTitle } = data.resume.personalInfo
                const autoTitle = jobTitle || `${firstName} ${lastName}'s Resume`
                titleInputRef.current.value = autoTitle.trim()
            }

            setTimeout(() => {
                setIsImportOpen(false)
            }, 1000)
        } catch (error) {
            console.error('Import error:', error)
            setImportStatus('error')
            setImportError('Failed to parse the resume. Please try again.')
        }
    }

    const resetImport = () => {
        setImportFile(null)
        setImportStatus('idle')
        setImportError('')
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-white border-b px-6 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard"><ChevronLeft className="h-5 w-5" /></Link>
                        </Button>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Create New Resume</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* CV Import Button */}
                        <Dialog open={isImportOpen} onOpenChange={(open) => { setIsImportOpen(open); if (!open) resetImport(); }}>
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
                                            ${isDragging ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}
                                            ${importFile ? 'border-green-500 bg-green-50' : ''}
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

                                        {importFile ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-12 h-12 text-green-600" />
                                                <p className="font-medium text-green-800">{importFile.name}</p>
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

                                    {importError && (
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {importError}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => { setIsImportOpen(false); resetImport(); }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleImport}
                                            disabled={!importFile || importStatus === 'parsing'}
                                            className="gap-2 bg-purple-600 hover:bg-purple-700"
                                        >
                                            {importStatus === 'parsing' && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {importStatus === 'success' && <CheckCircle className="w-4 h-4" />}
                                            {importStatus === 'parsing' ? 'Parsing...' : importStatus === 'success' ? 'Success!' : 'Import'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <span className="text-xl font-black text-purple-600">Plan Your Career</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-6">
                <form ref={formRef} action={createResume} className="space-y-12">
                    {/* Imported Data Banner */}
                    {importedData && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                            <div className="flex-1">
                                <p className="font-bold text-green-800">CV Imported Successfully!</p>
                                <p className="text-sm text-green-600">
                                    Found: {importedData.experience?.length || 0} experiences, {importedData.education?.length || 0} education entries, {importedData.skills?.length || 0} skills
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setImportedData(null)}
                                className="text-green-700 hover:text-green-800"
                            >
                                Clear
                            </Button>
                        </div>
                    )}

                    {/* Step 1: Title */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-2xl font-black text-gray-900">Give your resume a name</h2>
                        </div>
                        <Card className="p-8 max-w-xl">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase text-gray-400">Resume Title</label>
                                <Input
                                    ref={titleInputRef}
                                    name="title"
                                    placeholder="e.g. Senior Developer - Google Application"
                                    className="text-lg h-12 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-400 italic">This is only for your reference in the dashboard.</p>
                            </div>
                        </Card>
                    </section>

                    {/* Step 2: Template */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="text-2xl font-black text-gray-900">Choose a professional template</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="group cursor-pointer block"
                                    onClick={() => handleTemplateSelection(template.id)}
                                >
                                    <input
                                        type="radio"
                                        name="template_id"
                                        value={template.id}
                                        className="peer sr-only"
                                        checked={selectedTemplate === template.id}
                                        onChange={() => setSelectedTemplate(template.id)}
                                    />
                                    <Card className={`relative aspect-[1/1.41] overflow-hidden border-2 transition-all group-hover:shadow-2xl group-hover:-translate-y-1 bg-white p-0 ${selectedTemplate === template.id
                                        ? 'border-purple-600 ring-8 ring-purple-100'
                                        : 'border-transparent'
                                        }`}>
                                        <div className="absolute inset-0 pointer-events-none">
                                            <TemplatePreview templateId={template.id} />
                                        </div>

                                        <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/[0.02] transition-colors z-10" />
                                        <div className={`absolute top-4 right-4 bg-purple-600 text-white p-1.5 rounded-full transition-transform shadow-lg z-20 ${selectedTemplate === template.id ? 'scale-100' : 'scale-0'
                                            }`}>
                                            <Check className="h-5 w-5 stroke-[3px]" />
                                        </div>
                                    </Card>
                                    <div className="mt-6 text-center">
                                        <p className="font-black text-gray-900 text-lg group-hover:text-purple-600 transition-colors uppercase tracking-tight">{template.name}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{template.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center pt-8">
                        <Button
                            size="lg"
                            className="h-16 px-12 bg-purple-600 hover:bg-purple-700 text-xl font-black rounded-2xl shadow-xl hover:shadow-purple-200 transition-all active:scale-95"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </span>
                            ) : (
                                <> <Rocket className="h-6 w-6 mr-3" /> Start Building </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}

