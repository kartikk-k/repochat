"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { Copy, Download } from 'lucide-react'
import { toast } from 'sonner'

interface PromptPreviewDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function PromptPreviewDialog({ isOpen, onClose }: PromptPreviewDialogProps) {
    const { prompt } = useStore()

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt)
        toast.success('Copied to clipboard!')
    }

    const handleDownload = () => {
        const blob = new Blob([prompt], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'prompt.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Downloaded as prompt.txt')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-app-main border-app-border">
                <DialogHeader>
                    <DialogTitle className="text-app-text">Prompt Preview</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-app-input border border-app-border rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                        <pre className="text-sm text-app-text whitespace-pre-wrap font-mono leading-relaxed">
                            {prompt}
                        </pre>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="border-app-border text-app-text hover:bg-app-hover"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={handleDownload}
                            variant="outline"
                            className="border-app-border text-app-text hover:bg-app-hover"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button 
                            onClick={handleCopy}
                            className="bg-app-success text-primary-foreground hover:bg-app-success/90"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
