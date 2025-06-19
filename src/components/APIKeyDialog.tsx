"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Key, Eye, EyeOff } from "lucide-react"
import { useStore } from "@/store/useStore"

interface GitHubTokenDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (token: string) => void
}

export function GitHubTokenDialog({ isOpen, onClose, onSave }: GitHubTokenDialogProps) {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [showToken, setShowToken] = useState(false)

  const { setUseAuthToken, setGithubToken } = useStore()

  useEffect(() => {
    // Reset state when dialog opens
    if (isOpen) {
      const savedToken = localStorage.getItem("github-token") || ""
      setToken(savedToken)
      setError("")
    }
  }, [isOpen])

  const handleSave = () => {
    if (!token.trim()) {
      setError("Please enter a GitHub token")
      return
    }

    // Save token to localStorage
    localStorage.setItem("github-token", token)
    onSave(token)
    onClose()
  }

  const handleClear = () => {
    localStorage.removeItem("github-token")
    setToken("")
    setError("")
    setUseAuthToken(false)
    setGithubToken("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-sidebar border-border text-foreground/80 rounded-3xl outline outline-offset-4 outline-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            GitHub Personal Access Token
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Add your GitHub token to access private repositories. Your token will only be stored in your browser's local
            storage and never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="github-token">Personal Access Token</Label>
            <div className="relative">
              <Input
                id="github-token"
                type={showToken ? "text" : "password"}
                placeholder="github_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value)
                  setError("")
                }}
                className="bg-card border-border text-foreground/80 pb-2"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-neutral-600 h-6 w-6 rounded-[5px] flex items-center justify-center"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-card p-3 rounded-md border-2 border-dashed border-border text-sm space-y-2">
            <p className="font-medium">How to create a GitHub token:</p>
            <ol className="list-decimal list-inside space-y-1 text-neutral-400">
              <li>Go to <a href="https://github.com/settings/personal-access-tokens/new" className="underline text-blue-400">https://github.com/settings/personal-access-tokens/new</a></li>
              <li>Click "Generate new token" (classic)</li>
              <li>Select "All repositories" or "Only select repositories"</li>
              <li>Repository permissions &gt; Contents</li>
              <li>Select "Read only"</li>
              <li>Click "Generate token" and add here</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full sm:w-auto border-border text-foreground/80 hover:bg-transparent hover:text-foreground/80"
          >
            Clear Token
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto bg-input hover:bg-input/70 text-foreground/80">
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
