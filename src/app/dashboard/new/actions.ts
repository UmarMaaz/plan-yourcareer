'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ResumeData } from '@/types/resume'

export async function createResume(formData: FormData) {
    const title = formData.get('title') as string
    const template_id = formData.get('template_id') as string || 'modern'
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data, error } = await supabase
        .from('resumes')
        .insert([
            {
                title,
                user_id: user.id,
                template_id,
                data: {
                    personalInfo: {
                        email: user.email,
                        firstName: '',
                        lastName: '',
                    },
                    experience: [],
                    education: [],
                    skills: [],
                    languages: [],
                    certificates: [],
                },
            },
        ])
        .select()
        .single()

    if (error) {
        console.error('Error creating resume:', error)
        return redirect('/dashboard?message=Could not create resume')
    }

    return redirect(`/dashboard/resumes/${data.id}`)
}

export async function createResumeWithData(title: string, templateId: string, resumeData: ResumeData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Merge user email with imported data
    const mergedData: ResumeData = {
        ...resumeData,
        personalInfo: {
            ...resumeData.personalInfo,
            email: resumeData.personalInfo.email || user.email || '',
        },
    }

    const { data, error } = await supabase
        .from('resumes')
        .insert([
            {
                title,
                user_id: user.id,
                template_id: templateId,
                data: mergedData,
            },
        ])
        .select()
        .single()

    if (error) {
        console.error('Error creating resume with imported data:', error)
        return { error: 'Could not create resume' }
    }

    return { resumeId: data.id }
}

