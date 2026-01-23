'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, FileText, BookOpen, Upload, Plus, Trash2, Edit2, 
  Save, X, AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PDF {
  id: string
  title: string
  description: string
  file_url: string
  file_name: string
  file_size: number
  category: string
  created_at: string
}

interface Note {
  id: string
  title: string
  content: string
  category: string
  is_public: boolean
  created_at: string
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [uploading, setUploading] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '' })
  const [newPdf, setNewPdf] = useState({ title: '', description: '', category: '' })
  const [showNewNote, setShowNewNote] = useState(false)
  const [showNewPdf, setShowNewPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

    useEffect(() => {
      let isMounted = true
      
      async function checkAdmin() {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!isMounted) return
          
          if (!user) {
            router.push('/login')
            return
          }
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()
          
          if (!isMounted) return
          
          if (!profile?.is_admin) {
            router.push('/dashboard')
            return
          }
          
          setIsAdmin(true)
          fetchData()
        } catch (error) {
          console.error('Error in checkAdmin:', error)
          if (isMounted) router.push('/dashboard')
        }
      }
      
      checkAdmin()
      return () => { isMounted = false }
    }, [])

  async function fetchData() {
    setLoading(true)
    
    const { data: pdfData } = await supabase
      .from('admin_pdfs')
      .select('*')
      .order('created_at', { ascending: false })
    
    const { data: noteData } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    
    setPdfs(pdfData || [])
    setNotes(noteData || [])
    setLoading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !newPdf.title) return
    
    setUploading(true)
    
    const fileName = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('admin-pdfs')
      .upload(fileName, file)
    
    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message)
      setUploading(false)
      return
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('admin-pdfs')
      .getPublicUrl(fileName)
    
    const res = await fetch('/api/admin-pdfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newPdf.title,
        description: newPdf.description,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        category: newPdf.category || 'general'
      })
    })
    
    if (res.ok) {
      fetchData()
      setNewPdf({ title: '', description: '', category: '' })
      setShowNewPdf(false)
    } else {
      alert('Error creating PDF record')
    }
    
    setUploading(false)
  }

  async function deletePdf(id: string) {
    if (!confirm('Are you sure you want to delete this PDF?')) return
    
    const res = await fetch(`/api/admin-pdfs?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchData()
    }
  }

  async function createNote() {
    if (!newNote.title) return
    
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newNote.title,
        content: newNote.content,
        category: newNote.category || 'general',
        is_public: true
      })
    })
    
    if (res.ok) {
      fetchData()
      setNewNote({ title: '', content: '', category: '' })
      setShowNewNote(false)
    }
  }

  async function updateNote() {
    if (!editingNote) return
    
    const res = await fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingNote)
    })
    
    if (res.ok) {
      fetchData()
      setEditingNote(null)
    }
  }

  async function deleteNote(id: string) {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchData()
    }
  }

  if (loading || !isAdmin) {
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage PDFs and Notes</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="pdfs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pdfs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF Documents
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdfs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">PDF Documents</h2>
              <Button onClick={() => setShowNewPdf(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
            </div>

            {showNewPdf && (
              <Card className="p-6 border-2 border-purple-200">
                <h3 className="font-bold mb-4">Upload New PDF</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Title *</label>
                    <Input 
                      value={newPdf.title} 
                      onChange={e => setNewPdf({ ...newPdf, title: e.target.value })}
                      placeholder="PDF Title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                    <Textarea 
                      value={newPdf.description} 
                      onChange={e => setNewPdf({ ...newPdf, description: e.target.value })}
                      placeholder="Brief description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                    <Input 
                      value={newPdf.category} 
                      onChange={e => setNewPdf({ ...newPdf, category: e.target.value })}
                      placeholder="e.g., Templates, Guides"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || !newPdf.title}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Select & Upload PDF'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewPdf(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {pdfs.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No PDFs uploaded yet</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {pdfs.map(pdf => (
                  <Card key={pdf.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 rounded">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold">{pdf.title}</h3>
                        <p className="text-sm text-gray-500">{pdf.file_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{pdf.category}</span>
                      <Button variant="ghost" size="icon" onClick={() => deletePdf(pdf.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Notes</h2>
              <Button onClick={() => setShowNewNote(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>

            {showNewNote && (
              <Card className="p-6 border-2 border-purple-200">
                <h3 className="font-bold mb-4">Create New Note</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Title *</label>
                    <Input 
                      value={newNote.title} 
                      onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                      placeholder="Note Title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Content</label>
                    <Textarea 
                      value={newNote.content} 
                      onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                      placeholder="Note content..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                    <Input 
                      value={newNote.category} 
                      onChange={e => setNewNote({ ...newNote, category: e.target.value })}
                      placeholder="e.g., Tips, Guidelines"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createNote} disabled={!newNote.title} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Note
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewNote(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {notes.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notes created yet</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {notes.map(note => (
                  <Card key={note.id} className="p-4">
                    {editingNote?.id === note.id ? (
                      <div className="space-y-4">
                        <Input 
                          value={editingNote.title} 
                          onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                        />
                        <Textarea 
                          value={editingNote.content || ''} 
                          onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                          rows={4}
                        />
                        <Input 
                          value={editingNote.category || ''} 
                          onChange={e => setEditingNote({ ...editingNote, category: e.target.value })}
                          placeholder="Category"
                        />
                        <div className="flex gap-2">
                          <Button onClick={updateNote} size="sm" className="bg-purple-600">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button onClick={() => setEditingNote(null)} size="sm" variant="outline">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold">{note.title}</h3>
                          {note.content && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                          )}
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full mt-2 inline-block">
                            {note.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditingNote(note)}>
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
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
