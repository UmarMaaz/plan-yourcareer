import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ResumeEditor from '@/components/resume-editor'

export default async function ResumePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !resume) {
    return notFound()
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <ResumeEditor initialData={resume} />
    </div>
  )
}
