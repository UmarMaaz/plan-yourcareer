'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { MoreVertical, Trash2, Edit2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteResume } from '@/app/dashboard/actions'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ResumeActionsProps {
    resumeId: string
}

export function ResumeActions({ resumeId }: ResumeActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteResume(resumeId)
            } catch (error) {
                console.error('Failed to delete resume:', error)
                alert('Failed to delete resume. Please try again.')
            } finally {
                setShowDeleteDialog(false)
            }
        })
    }

    return (
        <>
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-xl shadow-lg bg-white/90 backdrop-blur hover:bg-white"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <MoreVertical className="h-5 w-5 text-gray-600" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-gray-100">
                        <DropdownMenuItem className="rounded-xl font-bold text-gray-600 py-3" asChild>
                            <Link href={`/dashboard/resumes/${resumeId}`} className="flex items-center gap-2">
                                <Edit2 className="h-4 w-4" /> Edit Resume
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="rounded-xl font-bold text-red-600 py-3 hover:bg-red-50 focus:bg-red-50 flex items-center gap-2"
                            onSelect={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="h-4 w-4" /> Delete Permanently
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-2xl border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="font-medium text-gray-500">
                            This action cannot be undone. This will permanently delete your resume and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 rounded-xl font-bold"
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
