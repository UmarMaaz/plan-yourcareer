'use client'

import { useState } from 'react'
import { Sparkles, Lightbulb, Loader2, ChevronDown, ChevronUp, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface Suggestion {
  title: string
  suggestion: string
  priority?: 'high' | 'medium' | 'low'
}

interface ATSSuggestionsProps {
  resumeData: any
  section: 'summary' | 'experience' | 'skills' | 'overall'
  fieldValue?: string
  jobTitle?: string
  onApplySuggestion?: (suggestion: string) => void
}

export function ATSSuggestions({
  resumeData,
  section,
  fieldValue = '',
  jobTitle = '',
  onApplySuggestion,
}: ATSSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const fetchSuggestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ats-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          section,
          fieldValue,
          jobTitle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get suggestions')
      }

      setSuggestions(data.suggestions)
      setIsExpanded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const priorityColors = {
    high: 'bg-red-50 border-red-200 text-red-700',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    low: 'bg-green-50 border-green-200 text-green-700',
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={fetchSuggestions}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300 hover:from-purple-100 hover:to-pink-100 text-purple-700 font-bold"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing for ATS...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Get AI ATS Suggestions
          </>
        )}
      </Button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="overflow-hidden border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                  <span className="font-bold text-gray-900">
                    ATS Suggestions ({suggestions.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "p-4 rounded-lg border bg-white",
                            suggestion.priority
                              ? priorityColors[suggestion.priority]
                              : "border-gray-100"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-sm text-gray-900">
                                  {suggestion.title}
                                </h4>
                                {suggestion.priority && (
                                  <span
                                    className={cn(
                                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                      priorityColors[suggestion.priority]
                                    )}
                                  >
                                    {suggestion.priority}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {suggestion.suggestion}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ATSOverallScore({ resumeData, jobTitle }: { resumeData: any; jobTitle?: string }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchOverallAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    setIsOpen(true)

    try {
      const response = await fetch('/api/ats-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          section: 'overall',
          fieldValue: '',
          jobTitle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      setSuggestions(data.suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const priorityColors = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-green-50 border-green-200',
  }

  return (
    <>
      <Button
        type="button"
        onClick={fetchOverallAnalysis}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            ATS Analysis
          </>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-xl">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">ATS Resume Analysis</h2>
                    <p className="text-sm text-gray-500">AI-powered suggestions to improve your resume</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
                    <p className="text-gray-500 font-medium">Analyzing your resume...</p>
                    <p className="text-sm text-gray-400">This may take a few seconds</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {!isLoading && suggestions.length > 0 && (
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-4 rounded-xl border-2",
                          suggestion.priority
                            ? priorityColors[suggestion.priority]
                            : "bg-gray-50 border-gray-100"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                              suggestion.priority === 'high'
                                ? 'bg-red-100 text-red-600'
                                : suggestion.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-green-100 text-green-600'
                            )}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{suggestion.title}</h4>
                              {suggestion.priority && (
                                <span
                                  className={cn(
                                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                    suggestion.priority === 'high'
                                      ? 'bg-red-100 text-red-600'
                                      : suggestion.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-green-100 text-green-600'
                                  )}
                                >
                                  {suggestion.priority} priority
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {suggestion.suggestion}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
