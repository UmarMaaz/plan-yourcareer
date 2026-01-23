'use client'

import { useRef, useEffect, useState } from 'react'
import { TemplateRenderer } from './TemplateRegistry'
import { ResumeData } from '@/types/resume'

const dummyData: ResumeData = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+1 (555) 234-5678',
    address: 'San Francisco, CA',
    jobTitle: 'Senior Product Manager',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    summary: 'Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement by 45% and driving $2M+ in annual revenue growth. Passionate about creating user-centric solutions that solve real business problems.',
  },
  experience: [
    {
      id: '1',
      company: 'TechVentures Inc.',
      position: 'Senior Product Manager',
      startDate: 'Jan 2021',
      endDate: 'Present',
      current: true,
      description: '• Led product strategy for flagship SaaS platform serving 500K+ users\n• Increased user retention by 35% through data-driven feature optimization\n• Managed $3M annual product budget and team of 12 engineers\n• Launched 3 major product features generating $1.5M in new revenue',
    },
    {
      id: '2',
      company: 'InnovateTech Solutions',
      position: 'Product Manager',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      current: false,
      description: '• Owned end-to-end product lifecycle for mobile application with 2M downloads\n• Collaborated with UX team to redesign onboarding flow, improving conversion by 28%\n• Conducted user research and A/B testing to validate product hypotheses',
    },
    {
      id: '3',
      company: 'Digital Dynamics',
      position: 'Associate Product Manager',
      startDate: 'Jun 2016',
      endDate: 'Feb 2018',
      current: false,
      description: '• Assisted in launching e-commerce platform features for 50+ enterprise clients\n• Created detailed PRDs and user stories for development teams\n• Analyzed market trends and competitive landscape to inform product roadmap',
    }
  ],
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'MBA, Technology Management',
      startDate: '2014',
      endDate: '2016',
      current: false,
    },
    {
      id: '2',
      school: 'UC Berkeley',
      degree: 'B.S. in Business Administration',
      startDate: '2010',
      endDate: '2014',
      current: false,
    }
  ],
  skills: [
    { id: '1', name: 'Product Strategy', level: 'Expert' },
    { id: '2', name: 'Agile/Scrum', level: 'Expert' },
    { id: '3', name: 'Data Analysis', level: 'Advanced' },
    { id: '4', name: 'SQL & Tableau', level: 'Advanced' },
    { id: '5', name: 'User Research', level: 'Advanced' },
    { id: '6', name: 'A/B Testing', level: 'Advanced' },
    { id: '7', name: 'Figma', level: 'Intermediate' },
    { id: '8', name: 'JIRA & Confluence', level: 'Expert' },
  ],
  languages: [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Spanish', level: 'Professional' },
    { id: '3', name: 'French', level: 'Conversational' },
  ],
  certificates: [
    { id: '1', name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: 'Mar 2020' },
    { id: '2', name: 'Google Analytics Certification', issuer: 'Google', date: 'Jan 2019' },
  ],
  publications: [],
}

interface TemplatePreviewProps {
  templateId: string
}

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.25)

    useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { offsetWidth: width, offsetHeight: height } = containerRef.current
        // Use the maximum scale to ensure the card is completely covered (no black/empty space)
        const scaleW = width / 800
        const scaleH = height / 1132
        setScale(Math.max(scaleW, scaleH))
      }
    }

    const observer = new ResizeObserver(updateScale)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    updateScale()
    return () => observer.disconnect()
  }, [])

    return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-white">
      <div 
        className="absolute top-0 left-0 origin-top-left pointer-events-none transition-transform duration-300 ease-out"
        style={{ 
          width: '800px', 
          height: '1132px',
          transform: `scale(${scale})`,
        }}
      >
        <TemplateRenderer templateId={templateId} data={dummyData} />
      </div>
    </div>
  )
}
