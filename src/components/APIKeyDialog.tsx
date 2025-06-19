"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface GitHubTokenDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (token: string) => void
}

export function GitHubTokenDialog({ isOpen, onClose, onSave }: GitHubTokenDialogProps) {
    const [token, setToken] = useState('')
    const [showToken, setShowToken] = useState(false)

    const handleSave = () => {
        if (token.trim()) {
            onSave(token.trim())
            setToken('')
        }
    }

    const handleClose = () => {
        setToken('')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-app-main border-app-border">
                <DialogHeader>
                    <DialogTitle className="text-app-text">GitHub Personal Access Token</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="token" className="text-app-text text-sm font-medium">
                            Personal Access Token
                        </Label>
                        <div className="relative">
                            <Input
                                id="token"
                                type={showToken ? "text" : "password"}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="ghp_xxxxxxxxxxxxxxxx"
                                className="bg-app-input border-app-border text-app-text placeholder:text-app-text-muted pr-10"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && token.trim()) {
                                        handleSave()
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowToken(!showToken)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted hover:text-app-text transition-colors"
                            >
                                {showToken ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                        <path d="m1 1 22 22"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm text-app-text-muted">
                        <p>
                            To access private repositories or increase rate limits, you'll need a GitHub Personal Access Token.
                        </p>
                        
                        <div className="space-y-2">
                            <p className="font-medium text-app-text">How to create a token:</p>
                            <ol className="list-decimal list-inside space-y-1 pl-4">
                                <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                                <li>Click "Generate new token (classic)"</li>
                                <li>Select scopes: <code className="bg-app-input px-1 py-0.5 rounded text-xs">repo</code> for private repos</li>
                                <li>Copy the generated token</li>
                            </ol>
                        </div>
                        
                        <div className="flex items-start gap-2 p-3 bg-app-accent-bg border border-app-success/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-app-success flex-shrink-0 mt-0.5">
                                <path d="m9 12 2 2 4-4"/>
                                <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1s-1 .448-1 1v3c0 .552.448 1 1 1z"/>
                                <path d="M3 12c-.552 0-1-.448-1-1V8c0-.552.448-1 1-1s1 .448 1 1v3c0 .552-.448 1-1 1z"/>
                                <path d="M12 21c.552 0 1-.448 1-1v-3c0-.552-.448-1-1-1s-1 .448-1 1v3c0 .552.448 1 1 1z"/>
                                <path d="M12 3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1s1-.448 1-1V4c0-.552-.448-1-1-1z"/>
                            </svg>
                            <div>
                                <p className="font-medium text-app-success">Secure Storage</p>
                                <p className="text-xs">Your token is stored locally in your browser and never sent to our servers.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 justify-end">
                    <Button 
                        variant="outline" 
                        onClick={handleClose}
                        className="border-app-border text-app-text hover:bg-app-hover"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!token.trim()}
                        className="bg-app-success text-primary-foreground hover:bg-app-success/90 disabled:opacity-50"
                    >
                        Save Token
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
