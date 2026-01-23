import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  FileText,
  Clock,
  MoreVertical,
  Layout,
  LogOut,
  Sparkles,
  ArrowRight,
  BookOpen,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ResumeCardPreview } from '@/components/resume-card-preview'
import { ResumeActions } from '@/components/resume-actions'
import { templates } from '@/lib/templates'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.is_admin || false

  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="flex-1 w-full bg-[#f8fafc] min-h-screen font-sans">
      {/* Top Navbar */}
      <nav className="w-full flex justify-center bg-white border-b h-16 sticky top-0 z-30">
        <div className="w-full max-w-7xl flex justify-between items-center px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
                alt="Plan Your Career Logo"
                className="h-8 w-auto"
              />
              <span className="font-black text-2xl tracking-tighter text-gray-900">Plan Your Career</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-purple-600 font-medium">
              <Link href="/dashboard/resources">
                <BookOpen className="h-4 w-4 mr-2" /> Resources
              </Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" asChild className="text-gray-600 hover:text-purple-600 font-medium">
                <Link href="/dashboard/admin">
                  <Shield className="h-4 w-4 mr-2" /> Admin
                </Link>
              </Button>
            )}
            <div className="h-8 w-px bg-gray-100 hidden md:block" />
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold uppercase text-gray-400">Account</span>
              <span className="text-sm font-bold text-gray-900">{user.email}</span>
            </div>
            <div className="h-8 w-px bg-gray-100 hidden md:block" />
            <form action="/auth/signout" method="post">
              <Button variant="ghost" className="text-gray-500 hover:text-red-600 font-bold">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">
        {/* Welcome Section */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-widest">
              <Sparkles className="h-4 w-4" /> Welcome back
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Your Dashboard</h1>
            <p className="text-gray-500 text-lg font-medium">Create and manage your professional applications in one place.</p>
          </div>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-purple-100 transition-all active:scale-95" asChild>
            <Link href="/dashboard/new">
              <Plus className="h-5 w-5 mr-2" /> Create New Resume
            </Link>
          </Button>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 text-red-600 p-4 mb-8 font-bold flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">!</div>
            Error loading resumes: {error.message}
          </Card>
        )}

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {resumes?.length === 0 ? (
            <div className="col-span-full py-20">
              <Card className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] border-4 border-dashed border-gray-100 shadow-none">
                <div className="bg-purple-50 p-6 rounded-3xl mb-8 text-purple-600">
                  <FileText className="h-16 w-16" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">No resumes yet</h3>
                <p className="text-gray-500 mb-10 text-center max-w-md text-lg font-medium leading-relaxed">
                  Start your professional journey today by choosing from our premium, recruiter-approved templates.
                </p>
                <Button size="lg" className="bg-purple-600 h-14 px-10 rounded-2xl font-black text-lg" asChild>
                  <Link href="/dashboard/new">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </Card>
            </div>
          ) : (
            resumes?.map((resume) => {
              const template = templates.find(t => t.id === resume.template_id) || templates[0]
              return (
                <div key={resume.id} className="group relative flex flex-col h-full">
                  <Link
                    href={`/dashboard/resumes/${resume.id}`}
                    className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-100 hover:border-purple-600 transition-all shadow-sm hover:shadow-2xl overflow-hidden"
                  >
                    {/* Visual Preview */}
                    <div className="aspect-[1/1.2] bg-gray-50 relative overflow-hidden group-hover:bg-purple-50 transition-colors">
                      <div className="absolute inset-4 bg-white shadow-lg rounded-sm overflow-hidden border border-gray-100 origin-top transform group-hover:scale-105 transition-transform duration-500">
                        <ResumeCardPreview templateId={resume.template_id} data={resume.data} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-6">
                      <h3 className="font-black text-xl mb-3 text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                        {resume.title}
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 w-fit px-2 py-1 rounded">
                          <Layout className="h-3 w-3" />
                          {template.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                          <Clock className="h-4 w-4" />
                          Last edited {new Date(resume.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <ResumeActions resumeId={resume.id} />
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
