'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
  Layout,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Settings,
  Upload,
  X,
  Sparkles,
  Minus,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { TemplateRenderer } from './resume-templates/TemplateRegistry'
import { templates } from '@/lib/templates'
import { Resume, ResumeData, ResumeSettings, Experience, Education, Skill, Language, Certificate, Publication } from '@/types/resume'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { MonthYearPicker } from '@/components/ui/month-year-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ATSSuggestions, ATSOverallScore } from '@/components/ats-suggestions'

export default function ResumeEditor({ initialData }: { initialData: Resume }) {
  const [resume, setResume] = useState<Resume>(initialData)
  const [activeTab, setActiveTab] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [zoom, setZoom] = useState(0.9)
  const [contentHeight, setContentHeight] = useState(0)
  const [activePage, setActivePage] = useState(1)
    const [previewMode, setPreviewMode] = useState<'pages' | 'continuous'>('pages')
    const contentRef = useRef<HTMLDivElement>(null)
    const pagesContainerRef = useRef<HTMLDivElement>(null)
    const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const supabase = createClient()
  const router = useRouter()

  const totalPages = (() => {
    const pageHeightIn = 11;
    const gapIn = 32 / 96;
    const scale = resume.data.settings?.contentScale || 1;
    const totalHeightIn = (contentHeight * scale) / 96;
    if (totalHeightIn <= pageHeightIn) return 1;
    return 1 + Math.ceil((totalHeightIn - pageHeightIn) / (pageHeightIn - gapIn));
  })();

  useEffect(() => {
      if (previewMode !== 'pages' || !pagesContainerRef.current) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = pageRefs.current.indexOf(entry.target as HTMLDivElement)
              if (index !== -1) {
                setActivePage(index + 1)
              }
            }
          })
        },
        {
          root: pagesContainerRef.current.parentElement,
          threshold: 0.5,
        }
      )

      pageRefs.current.forEach((page) => {
        if (page) observer.observe(page)
      })

      return () => observer.disconnect()
    }, [previewMode, contentHeight])

    const scrollToPage = (pageIndex: number) => {
      const page = pageRefs.current[pageIndex]
      if (page) {
        page.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    useEffect(() => {
      if (!contentRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height)
      }
    })
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [])

  const generateDescription = async (section: string, position?: string, company?: string, id?: string) => {
    const loadingKey = id || section
    setIsGenerating(loadingKey)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, position, company })
      })
      const data = await response.json()
      if (data.description) {
        if (section === 'summary') {
          handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, summary: data.description } }))
        } else if (section === 'experience' && id) {
          updateArrayItem('experience', id, { description: data.description })
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(null)
    }
  }

  const saveResume = useCallback(async (updatedResume: Resume) => {
    setIsSaving(true)
    const { error } = await supabase
      .from('resumes')
      .update({
        title: updatedResume.title,
        template_id: updatedResume.template_id,
        data: updatedResume.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updatedResume.id)

    if (error) {
      console.error('Error saving resume:', error)
    }
    setTimeout(() => setIsSaving(false), 500)
  }, [supabase])

  useEffect(() => {
    if (JSON.stringify(resume) === JSON.stringify(initialData)) return

    const timeout = setTimeout(() => {
      saveResume(resume)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [resume, saveResume, initialData])

  const handleDataChange = (updater: (prev: ResumeData) => ResumeData) => {
    setResume(prev => ({
      ...prev,
      data: updater(prev.data)
    }))
  }

  const addArrayItem = (key: keyof Omit<ResumeData, 'personalInfo' | 'settings'>) => {
    const newItem = { id: Math.random().toString(36).substr(2, 9) } as any
    handleDataChange(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newItem]
    }))
  }

  const updateArrayItem = (key: keyof Omit<ResumeData, 'personalInfo' | 'settings'>, id: string, updates: any) => {
    handleDataChange(prev => ({
      ...prev,
      [key]: ((prev[key] || []) as any[]).map(item => item.id === id ? { ...item, ...updates } : item)
    }))
  }

  const removeArrayItem = (key: keyof Omit<ResumeData, 'personalInfo' | 'settings'>, id: string) => {
    handleDataChange(prev => ({
      ...prev,
      [key]: ((prev[key] || []) as any[]).filter(item => item.id !== id)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${resume.id}-${Math.random()}.${fileExt}`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    handleDataChange(d => ({
      ...d,
      personalInfo: { ...d.personalInfo, profileImage: publicUrl }
    }))
  }

  const removeImage = () => {
    handleDataChange(d => ({
      ...d,
      personalInfo: { ...d.personalInfo, profileImage: undefined }
    }))
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Use browser's native print functionality - most reliable approach
      window.print()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      // Small delay to reset the button after print dialog closes
      setTimeout(() => setIsExporting(false), 500)
    }
  }

  const PageBreakIndicators = () => {
    const pageHeightIn = 11;
    const gapIn = 32 / 96;
    const scale = resume.data.settings?.contentScale || 1;
    const totalHeightIn = (contentHeight * scale) / 96;
    
    // First page always 11in
    const indicators = [];
    if (totalHeightIn > pageHeightIn) {
      indicators.push(pageHeightIn);
      
      let currentPos = pageHeightIn;
      while (currentPos + (pageHeightIn - gapIn) < totalHeightIn) {
        currentPos += (pageHeightIn - gapIn);
        indicators.push(currentPos);
      }
    }

    return (
      <>
        {indicators.map((top, i) => {
          const pageNum = i + 2;
          return (
            <div
              key={pageNum}
              className="page-break-indicator absolute left-0 right-0 pointer-events-none print:hidden"
              style={{ top: `${top}in` }}
            >
              <div className="relative w-full">
                <div className="absolute inset-x-0 border-t-2 border-dashed border-red-300" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                  Page {pageNum} starts here
                </div>
              </div>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden print:bg-white">
        <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                  /* Hide everything except resume */
                  body * {
                    visibility: hidden;
                  }
                  
                  /* Reset html and body for print */
                  html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    height: auto !important;
                    width: 8.5in !important;
                    overflow: visible !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  /* Hide non-print elements - but NOT headers inside resume */
                  .no-print, body > header, aside:not(.print-preview), nav, .print\\:hidden {
                    display: none !important;
                  }
                  
                  /* Ensure resume headers are visible */
                  .resume-print-container header {
                    display: block !important;
                    visibility: visible !important;
                  }
                  
                  /* Show the print preview area */
                  .print-preview {
                    visibility: visible !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 8.5in !important;
                    height: auto !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                    display: block !important;
                    overflow: visible !important;
                  }
                  
                  /* Reset zoom wrapper - hide it */
                  .zoom-wrapper {
                    display: none !important;
                  }
                  
                   /* Content scale wrapper - REMOVE transform for print to fix page breaks */
                   .content-scale-wrapper {
                     transform: none !important;
                     transform-origin: top left !important;
                     width: 100% !important;
                     min-height: auto !important;
                     height: auto !important;
                     overflow: visible !important;
                   }
                  
                  /* Show resume container and its contents */
                  .resume-print-container,
                  .resume-print-container * {
                    visibility: visible !important;
                  }
                  
                  /* Position the resume properly */
                  .resume-print-container {
                    position: relative !important;
                    left: auto !important;
                    top: auto !important;
                    width: 8.5in !important;
                    max-width: 8.5in !important;
                    min-height: auto !important;
                    height: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    overflow: visible !important;
                  }
                  
                  /* Preserve flex layouts */
                  .resume-print-container .flex { 
                    display: flex !important; 
                  }
                  
                  /* Preserve grid layouts */
                  .resume-print-container .grid { 
                    display: grid !important; 
                  }
                  
                  /* Preserve common Tailwind width classes */
                  .resume-print-container .w-1\\/2 { width: 50% !important; }
                  .resume-print-container .w-1\\/3 { width: 33.333333% !important; }
                  .resume-print-container .w-2\\/3 { width: 66.666667% !important; }
                  .resume-print-container .w-1\\/4 { width: 25% !important; }
                  .resume-print-container .w-3\\/4 { width: 75% !important; }
                  .resume-print-container .w-full { width: 100% !important; }
                  .resume-print-container .flex-1 { flex: 1 1 0% !important; }
                  
                  /* Preserve column spans */
                  .resume-print-container .col-span-2 { grid-column: span 2 / span 2 !important; }
                  .resume-print-container .col-span-3 { grid-column: span 3 / span 3 !important; }
                  
                  /* Preserve grid columns */
                  .resume-print-container .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                  .resume-print-container .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                  .resume-print-container .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
                  .resume-print-container .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
                  
                  /* Preserve column spans for 12-col grid */
                  .resume-print-container .col-span-4 { grid-column: span 4 / span 4 !important; }
                  .resume-print-container .col-span-8 { grid-column: span 8 / span 8 !important; }
                  
                  /* Preserve inline and inline-block */
                  .resume-print-container .inline { display: inline !important; }
                  .resume-print-container .inline-block { display: inline-block !important; }
                  
                  /* Preserve text alignment */
                  .resume-print-container .text-center { text-align: center !important; }
                  .resume-print-container .text-right { text-align: right !important; }
                  .resume-print-container .text-left { text-align: left !important; }
                  
                  /* Ensure background colors print */
                  .resume-print-container [class*="bg-"] {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                   /* NO page break rules - let content flow 100% naturally */
                   
                   /* Hide page break indicators in print */
                   .page-break-indicator {
                     display: none !important;
                     visibility: hidden !important;
                   }
           
                   @page {
                     margin: 0.4in 0.5in;
                     size: letter portrait;
                   }
                }
      
              /* Dynamic Font Override - FORCED */
              ${resume.data.settings?.fontFamily ? `
                .resume-print-container,
                .resume-print-container *,
                .resume-print-container h1,
                .resume-print-container h2,
                .resume-print-container h3,
                .resume-print-container h4,
                .resume-print-container h5,
                .resume-print-container h6,
                .resume-print-container p,
                .resume-print-container span,
                .resume-print-container div,
                .resume-print-container li {
                  font-family: ${resume.data.settings.fontFamily} !important;
                }
              ` : ''}
            ` }} />
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center z-20 no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <Input
            value={resume.title}
            onChange={e => setResume({ ...resume, title: e.target.value })}
            className="border-none font-bold text-lg focus-visible:ring-0 w-48 p-0 h-auto"
          />
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            {isSaving ? (
              <span className="flex items-center gap-1"><Save className="h-3 w-3 animate-pulse" /> Saving...</span>
            ) : (
              <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="h-3 w-3" /> Saved</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={resume.template_id}
            onValueChange={val => setResume({ ...resume, template_id: val })}
          >
            <SelectTrigger className="w-[180px] bg-gray-50">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <SelectValue placeholder="Template" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="lg:hidden">
            <Eye className="h-4 w-4 mr-2" /> {showPreview ? 'Edit' : 'Preview'}
          </Button>

          <Button
            className="bg-purple-600 hover:bg-purple-700 font-bold"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Exporting...
              </span>
            ) : (
              <><Download className="h-4 w-4 mr-2" /> Export PDF</>
            )}
          </Button>

          <ATSOverallScore
            resumeData={resume.data}
            jobTitle={resume.data.personalInfo.jobTitle}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 lg:w-64 bg-white border-r flex flex-col z-10 no-print">
          <nav className="flex-1 py-4 space-y-1 px-3">
{[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Wrench },
                { id: 'languages', label: 'Languages', icon: Languages },
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'publications', label: 'Publications', icon: BookOpen },
                { id: 'settings', label: 'Styling', icon: Settings },
              ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm",
                  activeTab === item.id
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-purple-600" : "text-gray-400")} />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Editor Area */}
        <main className={cn(
          "flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar transition-all no-print",
          showPreview ? "hidden lg:block" : "block"
        )}>
          <div className="max-w-3xl mx-auto space-y-8 pb-20 editor-area">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.section
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
                      <p className="text-gray-500 text-sm">How can employers contact you?</p>
                    </div>
                  </div>
                  <Card className="p-6 space-y-4">
                    {/* Profile Image Upload - Only for templates with images */}
                    {templates.find(t => t.id === resume.template_id)?.hasImage && (
                      <div className="flex items-center gap-6 pb-4 border-b border-gray-100">
                        <div className="relative group">
                          {resume.data.personalInfo.profileImage ? (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-100 shadow-sm">
                              <img
                                src={resume.data.personalInfo.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all">
                              <Upload className="h-6 w-6 text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Upload</span>
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Profile Picture</h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                            Recommended: Square image, max 2MB. This template supports a profile picture.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">First Name</label>
                        <Input
                          value={resume.data.personalInfo.firstName || ''}
                          onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, firstName: e.target.value } }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Last Name</label>
                        <Input
                          value={resume.data.personalInfo.lastName || ''}
                          onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, lastName: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400">Job Title</label>
                      <Input
                        placeholder="e.g. Senior Product Designer"
                        value={resume.data.personalInfo.jobTitle || ''}
                        onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, jobTitle: e.target.value } }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Email</label>
                        <Input
                          value={resume.data.personalInfo.email || ''}
                          onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, email: e.target.value } }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Phone</label>
                        <Input
                          value={resume.data.personalInfo.phone || ''}
                          onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, phone: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400">Address / Location</label>
                      <Input
                        placeholder="e.g. San Francisco, CA"
                        value={resume.data.personalInfo.address || ''}
                        onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, address: e.target.value } }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">LinkedIn</label>
                        <Input
                          placeholder="linkedin.com/in/yourprofile"
                          value={resume.data.personalInfo.linkedin || ''}
                          onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, linkedin: e.target.value } }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">GitHub</label>
                        <Input
                          placeholder="github.com/username"
                          value={resume.data.personalInfo.github || ''}
                          onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, github: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400">Website / Portfolio</label>
                      <Input
                        placeholder="yourwebsite.com"
                        value={resume.data.personalInfo.website || ''}
                        onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, website: e.target.value } }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase text-gray-400">Summary</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-7 text-[10px] font-bold"
                          onClick={() => generateDescription('summary', resume.data.personalInfo.jobTitle)}
                          disabled={isGenerating === 'summary'}
                        >
                          {isGenerating === 'summary' ? (
                            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 animate-pulse" /> Generating...</span>
                          ) : (
                            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Auto-fill with AI</span>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        rows={6}
                        placeholder="Tell your professional story..."
                        value={resume.data.personalInfo.summary || ''}
                        onChange={e => handleDataChange(d => ({ ...d, personalInfo: { ...d.personalInfo, summary: e.target.value } }))}
                      />

                      <ATSSuggestions
                        resumeData={resume.data}
                        section="summary"
                        fieldValue={resume.data.personalInfo.summary || ''}
                        jobTitle={resume.data.personalInfo.jobTitle}
                      />
                    </div>
                  </Card>
                </motion.section>
              )}

              {activeTab === 'experience' && (
                <motion.section key="experience" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Work Experience</h2>
                      <p className="text-gray-500 text-sm">Tell us about your previous roles.</p>
                    </div>
                    <Button onClick={() => addArrayItem('experience')} className="bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" /> Add Position
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(resume.data.experience || []).map((exp) => (
                      <Card key={exp.id} className="p-6 relative group border-2 border-transparent hover:border-purple-100 transition-all">

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 text-gray-300 hover:text-red-500"
                          onClick={() => removeArrayItem('experience', exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Position</label>
                            <Input value={exp.position || ''} onChange={e => updateArrayItem('experience', exp.id, { position: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Company</label>
                            <Input value={exp.company || ''} onChange={e => updateArrayItem('experience', exp.id, { company: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Start Date</label>
                              <MonthYearPicker
                                value={exp.startDate || ''}
                                onChange={(val) => updateArrayItem('experience', exp.id, { startDate: val })}
                                placeholder="Select start date"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-gray-400">End Date</label>
                              <MonthYearPicker
                                value={exp.endDate || ''}
                                onChange={(val) => updateArrayItem('experience', exp.id, { endDate: val })}
                                placeholder="Select end date"
                                allowPresent
                              />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-7 text-[10px] font-bold"
                              onClick={() => generateDescription('experience', exp.position, exp.company, exp.id)}
                              disabled={isGenerating === exp.id}
                            >
                              {isGenerating === exp.id ? (
                                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 animate-pulse" /> Generating...</span>
                              ) : (
                                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Auto-fill with AI</span>
                              )}
                            </Button>
                          </div>
                          <Textarea
                            rows={4}
                            value={exp.description || ''}
                            onChange={e => updateArrayItem('experience', exp.id, { description: e.target.value })}
                          />

                          <ATSSuggestions
                            resumeData={resume.data}
                            section="experience"
                            fieldValue={exp.description || ''}
                            jobTitle={resume.data.personalInfo.jobTitle}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeTab === 'education' && (
                <motion.section key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Education</h2>
                      <p className="text-gray-500 text-sm">Where did you study?</p>
                    </div>
                    <Button onClick={() => addArrayItem('education')} className="bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" /> Add School
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(resume.data.education || []).map((edu) => (
                      <Card key={edu.id} className="p-6 relative">

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 text-gray-300 hover:text-red-500"
                          onClick={() => removeArrayItem('education', edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Degree</label>
                            <Input value={edu.degree || ''} onChange={e => updateArrayItem('education', edu.id, { degree: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">School</label>
                            <Input value={edu.school || ''} onChange={e => updateArrayItem('education', edu.id, { school: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Graduation Year</label>
                              <MonthYearPicker
                                value={edu.endDate || ''}
                                onChange={(val) => updateArrayItem('education', edu.id, { endDate: val })}
                                placeholder="Select graduation date"
                              />
                            </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeTab === 'skills' && (
                <motion.section key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Skills</h2>
                      <p className="text-gray-500 text-sm">What are you great at?</p>
                    </div>
                    <Button onClick={() => addArrayItem('skills')} className="bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" /> Add Skill
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(resume.data.skills || []).map((skill) => (
                      <Card key={skill.id} className="p-4 flex items-center gap-3">

                        <Input
                          placeholder="Skill Name"
                          value={skill.name || ''}
                          onChange={e => updateArrayItem('skills', skill.id, { name: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-300 hover:text-red-500"
                          onClick={() => removeArrayItem('skills', skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                  <ATSSuggestions
                    resumeData={resume.data}
                    section="skills"
                    fieldValue={(resume.data.skills || []).map(s => s.name).filter(Boolean).join(', ')}
                    jobTitle={resume.data.personalInfo.jobTitle}
                  />
                </motion.section>
              )}

              {activeTab === 'languages' && (
                <motion.section key="languages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Languages</h2>
                      <p className="text-gray-500 text-sm">What languages do you speak?</p>
                    </div>
                    <Button onClick={() => addArrayItem('languages')} className="bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" /> Add Language
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(resume.data.languages || []).map((lang) => (
                      <Card key={lang.id} className="p-4 grid grid-cols-2 gap-4 items-end">

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-gray-400">Language</label>
                          <Input value={lang.name || ''} onChange={e => updateArrayItem('languages', lang.id, { name: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Level</label>
                            <Select value={lang.level || ''} onValueChange={val => updateArrayItem('languages', lang.id, { level: val })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Native">Native</SelectItem>
                                <SelectItem value="Fluent">Fluent</SelectItem>
                                <SelectItem value="Conversational">Conversational</SelectItem>
                                <SelectItem value="Basic">Basic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-300 hover:text-red-500 mb-[2px]"
                            onClick={() => removeArrayItem('languages', lang.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeTab === 'certificates' && (
                <motion.section key="certificates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Certificates</h2>
                      <p className="text-gray-500 text-sm">Show off your achievements.</p>
                    </div>
                    <Button onClick={() => addArrayItem('certificates')} className="bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" /> Add Certificate
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(resume.data.certificates || []).map((cert) => (
                      <Card key={cert.id} className="p-6 relative">

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 text-gray-300 hover:text-red-500"
                          onClick={() => removeArrayItem('certificates', cert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Certificate Name</label>
                            <Input value={cert.name || ''} onChange={e => updateArrayItem('certificates', cert.id, { name: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Issuer</label>
                            <Input value={cert.issuer || ''} onChange={e => updateArrayItem('certificates', cert.id, { issuer: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Date</label>
                              <MonthYearPicker
                                value={cert.date || ''}
                                onChange={(val) => updateArrayItem('certificates', cert.id, { date: val })}
                                placeholder="Select date"
                              />
                            </div>
                        </div>
                      </Card>
                      ))}
                    </div>
                  </motion.section>
                )}

                {activeTab === 'publications' && (
                  <motion.section key="publications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Publications & Research</h2>
                        <p className="text-gray-500 text-sm">Showcase your published work and research.</p>
                      </div>
                      <Button onClick={() => addArrayItem('publications')} className="bg-purple-600">
                        <Plus className="h-4 w-4 mr-2" /> Add Publication
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(resume.data.publications || []).map((pub) => (
                        <Card key={pub.id} className="p-6 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 text-gray-300 hover:text-red-500"
                            onClick={() => removeArrayItem('publications', pub.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Title</label>
                              <Input 
                                placeholder="Publication or research title"
                                value={pub.title || ''} 
                                onChange={e => updateArrayItem('publications', pub.id, { title: e.target.value })} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Publisher / Journal</label>
                              <Input 
                                placeholder="e.g. Nature, IEEE, etc."
                                value={pub.publisher || ''} 
                                onChange={e => updateArrayItem('publications', pub.id, { publisher: e.target.value })} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Date</label>
                              <MonthYearPicker
                                value={pub.date || ''}
                                onChange={(val) => updateArrayItem('publications', pub.id, { date: val })}
                                placeholder="Select date"
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Authors</label>
                              <Input 
                                placeholder="e.g. John Doe, Jane Smith"
                                value={pub.authors || ''} 
                                onChange={e => updateArrayItem('publications', pub.id, { authors: e.target.value })} 
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <label className="text-xs font-bold uppercase text-gray-400">URL (Optional)</label>
                              <Input 
                                placeholder="https://..."
                                value={pub.url || ''} 
                                onChange={e => updateArrayItem('publications', pub.id, { url: e.target.value })} 
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <label className="text-xs font-bold uppercase text-gray-400">Description (Optional)</label>
                              <Textarea
                                rows={3}
                                placeholder="Brief description or abstract..."
                                value={pub.description || ''}
                                onChange={e => updateArrayItem('publications', pub.id, { description: e.target.value })}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.section>
                )}

{activeTab === 'settings' && (
                  <motion.section key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Styling & Settings</h2>
                        <p className="text-gray-500 text-sm">Customize the look of your resume.</p>
                      </div>
                    </div>

                    {/* Spacing Section */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Spacing</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">Font Size</label>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{resume.data.settings?.fontSize || 10}pt</span>
                        </div>
                        <Slider
                          value={[resume.data.settings?.fontSize || 10]}
                          min={8}
                          max={14}
                          step={1}
                          onValueChange={([val]) => handleDataChange(d => ({ ...d, settings: { ...d.settings, fontSize: val } }))}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">Line Height</label>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{resume.data.settings?.lineHeight || 1.25}</span>
                        </div>
                        <Slider
                          value={[resume.data.settings?.lineHeight || 1.25]}
                          min={1}
                          max={2}
                          step={0.05}
                          onValueChange={([val]) => handleDataChange(d => ({ ...d, settings: { ...d.settings, lineHeight: val } }))}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">Left & Right Margin</label>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{resume.data.settings?.leftRightMargin || 20}mm</span>
                        </div>
                        <Slider
                          value={[resume.data.settings?.leftRightMargin || 20]}
                          min={10}
                          max={50}
                          step={2}
                          onValueChange={([val]) => handleDataChange(d => ({ ...d, settings: { ...d.settings, leftRightMargin: val } }))}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">Top & Bottom Margin</label>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{resume.data.settings?.topBottomMargin || 15}mm</span>
                        </div>
                        <Slider
                          value={[resume.data.settings?.topBottomMargin || 15]}
                          min={10}
                          max={50}
                          step={2}
                          onValueChange={([val]) => handleDataChange(d => ({ ...d, settings: { ...d.settings, topBottomMargin: val } }))}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">Space Between Entries</label>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{resume.data.settings?.entrySpacing || 8}px</span>
                        </div>
                        <Slider
                          value={[resume.data.settings?.entrySpacing || 8]}
                          min={0}
                          max={20}
                          step={2}
                          onValueChange={([val]) => handleDataChange(d => ({ ...d, settings: { ...d.settings, entrySpacing: val } }))}
                        />
                      </div>
                    </Card>

                    {/* Colors Section */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Colors</h3>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {['basic', 'advanced', 'border'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, colorMode: mode as any } }))}
                            className={cn(
                              "py-2 px-3 rounded-lg text-xs font-medium capitalize",
                              (resume.data.settings?.colorMode || 'basic') === mode
                                ? "bg-purple-100 text-purple-700 border-2 border-purple-600"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            )}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-8 gap-2">
                        {[
                          '#7c3aed', '#2563eb', '#059669', '#ea580c', '#e11d48', '#475569',
                          '#1e3a5f', '#4f46e5', '#0d9488', '#d97706', '#0891b2', '#6b7280',
                          '#dc2626', '#16a34a', '#9333ea', '#f97316'
                        ].map(color => (
                          <button
                            key={color}
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, accentColor: color } }))}
                            className={cn(
                              "w-8 h-8 rounded-lg transition-all",
                              resume.data.settings?.accentColor === color
                                ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                                : "hover:scale-105"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <label className="text-xs font-medium text-gray-500">Custom:</label>
                        <input
                          type="color"
                          value={resume.data.settings?.accentColor || '#7c3aed'}
                          onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, accentColor: e.target.value } }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <Input
                          value={resume.data.settings?.accentColor || '#7c3aed'}
                          onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, accentColor: e.target.value } }))}
                          className="w-24 h-8 text-xs font-mono uppercase"
                        />
                      </div>

                      {/* Show Border */}
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Show Border</label>
                          <button
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, showBorder: !d.settings?.showBorder } }))}
                            className={cn(
                              "w-12 h-7 rounded-full transition-all relative",
                              resume.data.settings?.showBorder ? "bg-purple-600" : "bg-gray-200"
                            )}
                          >
                            <span className={cn(
                              "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm",
                              resume.data.settings?.showBorder ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>

                        {resume.data.settings?.showBorder && (
                          <div className="grid grid-cols-4 gap-2">
                            {(['top', 'bottom', 'left', 'right'] as const).map(side => (
                              <label key={side} className="flex items-center gap-2 text-xs">
                                <input
                                  type="checkbox"
                                  checked={resume.data.settings?.borderSides?.[side] ?? false}
                                  onChange={e => handleDataChange(d => ({
                                    ...d,
                                    settings: {
                                      ...d.settings,
                                      borderSides: { ...d.settings?.borderSides, [side]: e.target.checked }
                                    }
                                  }))}
                                  className="rounded border-gray-300"
                                />
                                <span className="capitalize">{side}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Apply Accent Color To */}
                      <div className="pt-4 border-t space-y-3">
                        <label className="text-sm font-medium text-gray-700">Apply Accent Color To</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'name', label: 'Name' },
                            { key: 'jobTitle', label: 'Job Title' },
                            { key: 'headings', label: 'Headings' },
                            { key: 'dates', label: 'Dates' },
                            { key: 'linkIcons', label: 'Link Icons' },
                            { key: 'iconsBars', label: 'Icons/Bars/Bubbles' },
                            { key: 'headingsLine', label: 'Headings Line' },
                            { key: 'headerIcons', label: 'Header Icons' },
                          ].map(item => (
                            <label key={item.key} className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={(resume.data.settings?.applyAccentTo as any)?.[item.key] ?? false}
                                onChange={e => handleDataChange(d => ({
                                  ...d,
                                  settings: {
                                    ...d.settings,
                                    applyAccentTo: { ...d.settings?.applyAccentTo, [item.key]: e.target.checked }
                                  }
                                }))}
                                className="rounded border-gray-300"
                              />
                              <span>{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </Card>

                        {/* Font Section */}
                        <Card className="p-6 space-y-4">
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Font</h3>
                          
                          <div className="flex flex-wrap gap-2">
                            {[
                              { name: 'Inter', value: '"Inter", sans-serif' },
                              { name: 'Arial', value: 'Arial, sans-serif' },
                              { name: 'Playfair Display', value: '"Playfair Display", serif' },
                              { name: 'Georgia', value: 'Georgia, serif' },
                              { name: 'Times New Roman', value: '"Times New Roman", serif' },
                              { name: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
                            ].map(font => (
                              <button
                                key={font.name}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, fontFamily: font.value } }))}
                                className={cn(
                                  "px-4 py-2 text-sm rounded-full border transition-all",
                                  (resume.data.settings?.fontFamily || '"Inter", sans-serif') === font.value
                                    ? "border-purple-600 bg-purple-50 text-purple-700"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                                style={{ fontFamily: font.value }}
                              >
                                {font.name}
                              </button>
                            ))}
                          </div>
                        </Card>

                    {/* Section Headings */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Section Headings</h3>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Style</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { value: 'line-below', icon: '▬' },
                            { value: 'line-above', icon: '▔' },
                            { value: 'line-both', icon: '═' },
                            { value: 'box', icon: '▢' },
                            { value: 'none', icon: '○' },
                          ].map(style => (
                            <button
                              key={style.value}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, headingStyle: style.value as any } }))}
                              className={cn(
                                "border rounded-lg p-2 text-center text-lg",
                                (resume.data.settings?.headingStyle || 'line-below') === style.value
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {style.icon}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Capitalization</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Capitalize', 'UPPERCASE'].map(cap => (
                            <button
                              key={cap}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, headingCapitalization: cap.toLowerCase() as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium",
                                (resume.data.settings?.headingCapitalization || 'uppercase') === cap.toLowerCase()
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {cap}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['small', 'medium', 'large'].map(size => (
                            <button
                              key={size}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, headingSize: size as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.headingSize || 'medium') === size
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Icons</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['none', 'outline', 'filled'].map(icon => (
                            <button
                              key={icon}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, headingIcons: icon as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.headingIcons || 'none') === icon
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Personal Details */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Personal Details</h3>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Align</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, personalDetailsAlign: align as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.personalDetailsAlign || 'left') === align
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Arrangement</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'row', label: 'Row' },
                            { value: 'wrap', label: 'Wrap' },
                            { value: 'bullet', label: '• Bullet' },
                            { value: 'line', label: '| Line' },
                          ].map(arr => (
                            <button
                              key={arr.value}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, personalDetailsArrangement: arr.value as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium",
                                (resume.data.settings?.personalDetailsArrangement || 'row') === arr.value
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {arr.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Icon Style</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['none', 'outline', 'filled', 'text'].map(style => (
                            <button
                              key={style}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, personalDetailsIconStyle: style as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.personalDetailsIconStyle || 'none') === style
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Name */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Name</h3>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Size</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['small', 'medium', 'large', 'xlarge'].map(size => (
                            <button
                              key={size}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, nameSize: size as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.nameSize || 'large') === size
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {size === 'xlarge' ? 'XL' : size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={resume.data.settings?.nameBold ?? true}
                            onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, nameBold: e.target.checked } }))}
                            className="rounded border-gray-300"
                          />
                          Name Bold
                        </label>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Font</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['body', 'creative'].map(font => (
                              <button
                                key={font}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, nameFont: font as any } }))}
                                className={cn(
                                  "border rounded-lg py-2 text-xs font-medium capitalize",
                                  (resume.data.settings?.nameFont || 'body') === font
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                {font === 'body' ? 'Body Font' : 'Creative'}
                              </button>
                            ))}
                            </div>
                          </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Alignment</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['left', 'center', 'right'].map(align => (
                              <button
                                key={align}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, nameAlign: align as any } }))}
                                className={cn(
                                  "border rounded-lg py-2 text-xs font-medium capitalize",
                                  (resume.data.settings?.nameAlign || 'left') === align
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Arrangement</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'row', label: 'Row' },
                              { value: 'stacked', label: 'Stacked' },
                              { value: 'stacked-reverse', label: 'Last First' },
                            ].map(arr => (
                              <button
                                key={arr.value}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, nameArrangement: arr.value as any } }))}
                                className={cn(
                                  "border rounded-lg py-2 text-xs font-medium",
                                  (resume.data.settings?.nameArrangement || 'row') === arr.value
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                {arr.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        </Card>

                      {/* Photo Settings */}
                      <Card className="p-6 space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Photo</h3>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Size</label>
                          <div className="grid grid-cols-4 gap-2">
                            {['small', 'medium', 'large', 'xlarge'].map(size => (
                              <button
                                key={size}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, photoSize: size as any } }))}
                                className={cn(
                                  "border rounded-lg py-2 text-xs font-medium capitalize",
                                  (resume.data.settings?.photoSize || 'medium') === size
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                {size === 'xlarge' ? 'XL' : size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Shape</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'circle', label: 'Circle' },
                              { value: 'rounded', label: 'Rounded' },
                              { value: 'square', label: 'Square' },
                            ].map(shape => (
                              <button
                                key={shape.value}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, photoShape: shape.value as any } }))}
                                className={cn(
                                  "border rounded-lg py-2 text-xs font-medium",
                                  (resume.data.settings?.photoShape || 'circle') === shape.value
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                {shape.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Position</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['left', 'center', 'right'].map(pos => (
                              <button
                                key={pos}
                                onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, photoPosition: pos as any } }))}
                                className={cn(
                                  "border rounded-lg py-2 text-xs font-medium capitalize",
                                  (resume.data.settings?.photoPosition || 'center') === pos
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="text-sm font-medium text-gray-700">Show Border</label>
                          <button
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, photoBorder: !d.settings?.photoBorder } }))}
                            className={cn(
                              "w-12 h-7 rounded-full transition-all relative",
                              resume.data.settings?.photoBorder ? "bg-purple-600" : "bg-gray-200"
                            )}
                          >
                            <span className={cn(
                              "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm",
                              resume.data.settings?.photoBorder ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>

                        {resume.data.settings?.photoBorder && (
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-medium text-gray-500">Border Color:</label>
                            <input
                              type="color"
                              value={resume.data.settings?.photoBorderColor || resume.data.settings?.accentColor || '#7c3aed'}
                              onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, photoBorderColor: e.target.value } }))}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                          </div>
                        )}
                      </Card>

                      {/* Skills Display */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {['grid', 'level', 'compact', 'bubble', 'text', 'dots', 'bar'].map(display => (
                          <button
                            key={display}
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, skillsDisplay: display as any } }))}
                            className={cn(
                              "px-3 py-2 text-xs rounded-full border transition-all capitalize",
                              (resume.data.settings?.skillsDisplay || 'bubble') === display
                                ? "border-purple-600 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {display}
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Languages Display */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {['grid', 'compact', 'bubble', 'text', 'dots', 'bar'].map(display => (
                          <button
                            key={display}
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, languagesDisplay: display as any } }))}
                            className={cn(
                              "px-3 py-2 text-xs rounded-full border transition-all capitalize",
                              (resume.data.settings?.languagesDisplay || 'text') === display
                                ? "border-purple-600 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {display}
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Entry Layout */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Entry Layout</h3>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {['stacked', 'inline', 'timeline'].map(layout => (
                          <button
                            key={layout}
                            onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, entryLayout: layout as any } }))}
                            className={cn(
                              "border rounded-lg py-2 text-xs font-medium capitalize",
                              (resume.data.settings?.entryLayout || 'stacked') === layout
                                ? "border-purple-600 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {layout}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Subtitle Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['normal', 'bold', 'italic'].map(style => (
                            <button
                              key={style}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, entrySubtitleStyle: style as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.entrySubtitleStyle || 'normal') === style
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Subtitle Placement</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['same-line', 'next-line'].map(placement => (
                            <button
                              key={placement}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, entrySubtitlePlacement: placement as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium",
                                (resume.data.settings?.entrySubtitlePlacement || 'next-line') === placement
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {placement === 'same-line' ? 'By Same Line' : 'Next Line'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={resume.data.settings?.entryDescriptionIndent ?? false}
                          onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, entryDescriptionIndent: e.target.checked } }))}
                          className="rounded border-gray-300"
                        />
                        <label className="text-sm font-medium text-gray-700">Indent Body</label>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">List Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'bullet', label: '• Bullet' },
                            { value: 'hyphen', label: '- Hyphen' },
                            { value: 'none', label: 'None' },
                          ].map(style => (
                            <button
                              key={style.value}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, entryListStyle: style.value as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium",
                                (resume.data.settings?.entryListStyle || 'bullet') === style.value
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Education & Experience Order */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Education</h3>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Title & Subtitle Order</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['degree-school', 'school-degree'].map(order => (
                            <button
                              key={order}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, educationOrder: order as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium",
                                (resume.data.settings?.educationOrder || 'degree-school') === order
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {order === 'degree-school' ? 'Degree, School' : 'School, Degree'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Work Experience</h3>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Order Title/Subtitle</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['title-employer', 'employer-title'].map(order => (
                            <button
                              key={order}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, experienceOrder: order as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium",
                                (resume.data.settings?.experienceOrder || 'title-employer') === order
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {order === 'title-employer' ? 'Job Title > Employer' : 'Employer > Job Title'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={resume.data.settings?.groupPositions ?? false}
                          onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, groupPositions: e.target.checked } }))}
                          className="rounded border-gray-300"
                        />
                        <label className="text-sm font-medium text-gray-700">Group Positions</label>
                      </div>
                    </Card>

                    {/* Footer */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Footer</h3>
                      <div className="space-y-2">
                        {[
                          { key: 'showPageNumbers', label: 'Page Numbers' },
                          { key: 'showFooterEmail', label: 'Email' },
                          { key: 'showFooterName', label: 'Name' },
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={(resume.data.settings as any)?.[item.key] ?? false}
                              onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, [item.key]: e.target.checked } }))}
                              className="rounded border-gray-300"
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </Card>

                    {/* Advanced */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Advanced</h3>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Link Icon</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['none', 'icon', 'text'].map(linkIcon => (
                            <button
                              key={linkIcon}
                              onClick={() => handleDataChange(d => ({ ...d, settings: { ...d.settings, linkIcon: linkIcon as any } }))}
                              className={cn(
                                "border rounded-lg py-2 text-xs font-medium capitalize",
                                (resume.data.settings?.linkIcon || 'none') === linkIcon
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {linkIcon}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={resume.data.settings?.reduceDateLocationOpacity ?? false}
                          onChange={e => handleDataChange(d => ({ ...d, settings: { ...d.settings, reduceDateLocationOpacity: e.target.checked } }))}
                          className="rounded border-gray-300"
                        />
                        <label className="text-sm font-medium text-gray-700">Reduce opacity of dates and locations</label>
                      </div>
                    </Card>

                    {/* Content Scale (keeping for backwards compat) */}
                    <Card className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-purple-600">Content Scale</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">Overall Scale</label>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{Math.round((resume.data.settings?.contentScale || 1) * 100)}%</span>
                        </div>
                        <Slider
                          value={[resume.data.settings?.contentScale || 1]}
                          min={0.85}
                          max={1.15}
                          step={0.05}
                          onValueChange={([val]) => handleDataChange(d => ({ ...d, settings: { ...d.settings, contentScale: val } }))}
                          className="w-full"
                        />
                      </div>
                    </Card>
                  </motion.section>
                )}
            </AnimatePresence>
          </div>
        </main>

        {/* Preview Area */}
        <aside className={cn(
          "bg-gray-200 p-8 flex flex-col items-center overflow-auto custom-scrollbar transition-all print-preview print:flex print:p-0 print:bg-white relative",
          showPreview ? "fixed inset-0 z-30 flex" : "hidden lg:flex w-[45%]"
        )}>
          {showPreview && (
            <Button
              variant="outline"
              className="fixed top-4 right-4 z-40 bg-white"
              onClick={() => setShowPreview(false)}
            >
              Close Preview
            </Button>
          )}

            {/* Hidden measurement container for content height and printing */}
            <div className="fixed -left-[10000px] top-0 pointer-events-none opacity-0 print:static print:left-0 print:opacity-100 print:pointer-events-auto print:block">
              <div className="w-[8.5in] print:w-full">
                <div
                  className="bg-white shadow-2xl w-[8.5in] flex-shrink-0 resume-print-container relative print:shadow-none print:w-[8.5in]"
                  style={{
                    minHeight: '11in',
                    printColorAdjust: 'exact',
                    WebkitPrintColorAdjust: 'exact'
                  }}
                >
                    <div ref={contentRef} className="content-scale-wrapper" style={{
                      transform: `scale(${resume.data.settings?.contentScale || 1})`,
                      transformOrigin: 'top left',
                      paddingTop: '0px',
                      width: `calc(100% * ${1 / (resume.data.settings?.contentScale || 1)})`,
                      fontFamily: resume.data.settings?.fontFamily || 'inherit',
                      '--resume-page-height': `${11 / (resume.data.settings?.contentScale || 1)}in`
                    } as any}>
                    <TemplateRenderer templateId={resume.template_id} data={resume.data} />
                  </div>
                </div>
              </div>
            </div>

          {/* Preview Controls */}
          <div className="flex items-center gap-4 mb-6 sticky top-0 z-20 no-print">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setPreviewMode('pages')}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                  previewMode === 'pages' ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Separate Pages
              </button>
              <button
                onClick={() => setPreviewMode('continuous')}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                  previewMode === 'continuous' ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Continuous
              </button>
            </div>

              {previewMode === 'pages' && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={activePage <= 1}
                      onClick={() => {
                        if (previewMode === 'pages') {
                          setActivePage(prev => Math.max(1, prev - 1))
                        } else {
                          scrollToPage(activePage - 2)
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-bold px-2">
                      {activePage} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={activePage >= totalPages}
                      onClick={() => {
                        if (previewMode === 'pages') {
                          setActivePage(prev => prev + 1)
                        } else {
                          scrollToPage(activePage)
                        }
                      }}
                    >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
          </div>

          {/* Zoom Controls */}
          <div className="fixed bottom-8 right-8 flex items-center gap-2 z-40 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg border border-gray-200 print:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 px-2 min-w-[3rem] rounded-full text-xs font-bold bg-white/50 hover:bg-white"
              onClick={() => setZoom(1)}
              title="Reset to 100%"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div 
            className="zoom-wrapper relative origin-top transition-transform duration-200 ease-in-out print:!hidden" 
            style={{ transform: `scale(${zoom})` }}
          >
              {previewMode === 'continuous' ? (
                  <div
                    className="bg-white shadow-2xl w-[8.5in] flex-shrink-0 resume-print-container relative print:shadow-none print:w-full"
                    style={{
                      minHeight: '11in',
                      height: `${totalPages * 11}in`,
                      printColorAdjust: 'exact',
                      WebkitPrintColorAdjust: 'exact',
                      background: previewMode === 'continuous' ? `repeating-linear-gradient(
                        white,
                        white 11in,
                        #e5e7eb 11in,
                        #e5e7eb calc(11in + 32px),
                        white calc(11in + 32px),
                        white calc(11in + 11in + (11in - 32px))
                      )` : 'white'
                    }}
                  >
                    {/* Continuous mode background spacer markers */}
                    <div className="absolute inset-0 pointer-events-none print:hidden">
                      {Array.from({ length: totalPages - 1 }).map((_, i) => {
                        const gapIn = 32 / 96;
                        const top = 11 + i * (11 - gapIn);
                        return (
                          <div 
                            key={i} 
                            className="absolute left-0 right-0 bg-gray-100 border-y border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                            style={{ 
                              top: `${top}in`, 
                              height: '32px' 
                            }}
                          >
                            Page Break
                          </div>
                        );
                      })}
                    </div>
                      <div className="content-scale-wrapper print:!transform-none print:!w-full" style={{
                        transform: `scale(${resume.data.settings?.contentScale || 1})`,
                        transformOrigin: 'top left',
                        paddingTop: '0px',
                        width: `calc(100% * ${1 / (resume.data.settings?.contentScale || 1)})`,
                        fontFamily: resume.data.settings?.fontFamily || 'inherit',
                        '--resume-page-height': `${11 / (resume.data.settings?.contentScale || 1)}in`
                      } as any}>
                    <TemplateRenderer templateId={resume.template_id} data={resume.data} />
                  </div>
                  <PageBreakIndicators />
                </div>
                ) : (
                    <div ref={pagesContainerRef} className="flex flex-col items-center gap-8 pb-32">
                        {[activePage - 1].map((pageIndex) => {
                          const scale = resume.data.settings?.contentScale || 1;
                          const pageHeightIn = 11;
                          
                          const translationIn = pageIndex * pageHeightIn;
                              
                              return (
                                <div
                                  key={pageIndex}
                                  ref={el => { pageRefs.current[pageIndex] = el }}
                                  className={cn(
                                    "bg-white shadow-2xl w-[8.5in] h-[11in] flex-shrink-0 relative overflow-hidden transition-all duration-300"
                                  )}
                                  style={{
                                    printColorAdjust: 'exact',
                                    WebkitPrintColorAdjust: 'exact'
                                  }}
                                >
                                  <div 
                                    className="content-scale-wrapper" 
                                    style={{
                                      transform: `scale(${scale}) translateY(-${translationIn / scale}in)`,
                                      transformOrigin: 'top left',
                                      width: `calc(100% * ${1 / scale})`,
                                      fontFamily: resume.data.settings?.fontFamily || 'inherit',
                                      '--resume-page-height': `${11 / scale}in`
                                    } as any}
                                  >
                                    <TemplateRenderer templateId={resume.template_id} data={resume.data} />
                                  </div>
                                </div>
                              )
                        })}
                      </div>
            )}
          </div>
        </aside>
      </div >
    </div >
  )
}
