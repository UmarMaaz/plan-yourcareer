'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ChevronLeft, FileText, BookOpen, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PDF {
  id: string
  title: string
  description: string
  file_url: string
  file_name: string
  category: string
  created_at: string
}

interface Note {
  id: string
  title: string
  content: string
  category: string
  created_at: string
}

export default function ResourcesPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResources() {
      try {
        const [pdfRes, noteRes] = await Promise.all([
          fetch('/api/admin-pdfs'),
          fetch('/api/notes')
        ])
        
        const pdfData = await pdfRes.json()
        const noteData = await noteRes.json()
        
        setPdfs(pdfData.pdfs || [])
        setNotes(noteData.notes || [])
      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchResources()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
            <p className="text-sm text-gray-500">View helpful documents and notes</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="pdfs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pdfs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdfs">
            {pdfs.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No documents available</h3>
                <p className="text-sm text-gray-500 mt-1">Check back later for helpful resources</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pdfs.map(pdf => (
                  <Card key={pdf.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{pdf.title}</h3>
                        {pdf.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pdf.description}</p>
                        )}
                        {pdf.category && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {pdf.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <a href={pdf.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                        <a href={pdf.file_url} download={pdf.file_name}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes">
            {notes.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No notes available</h3>
                <p className="text-sm text-gray-500 mt-1">Check back later for helpful notes</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {notes.map(note => (
                  <Card key={note.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{note.title}</h3>
                        {note.category && (
                          <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                            {note.category}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {note.content && (
                      <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
                        {note.content}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
