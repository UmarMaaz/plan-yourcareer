'use client'

import { ResumeData } from '@/types/resume'
import { TemplateRenderer } from './resume-templates/TemplateRegistry'
import { useEffect, useRef, useState } from 'react'

interface ResumeCardPreviewProps {
    templateId: string
    data: ResumeData
}

export function ResumeCardPreview({ templateId, data }: ResumeCardPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0.2) // Initial guess

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { offsetWidth } = containerRef.current.parentElement || { offsetWidth: 0 }
                if (offsetWidth > 0) {
                    // A4 width is 210mm. At 96 DPI, that's 793.7px.
                    const a4WidthPx = 793.7
                    const newScale = offsetWidth / a4WidthPx
                    setScale(newScale)
                }
            }
        }

        updateScale()
        window.addEventListener('resize', updateScale)
        return () => window.removeEventListener('resize', updateScale)
    }, [])

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-white">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: '210mm',
                    height: '297mm',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none'
                }}
            >
                <TemplateRenderer templateId={templateId} data={data} />
            </div>
        </div>
    )
}
