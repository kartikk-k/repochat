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
import { safeLocalStorage } from "@/lib/localStorage"

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
      const savedToken = safeLocalStorage.getItem("github-token") || ""
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
    safeLocalStorage.setItem("github-token", token)
    onSave(token)
    onClose()
  }

  const handleClear = () => {
    safeLocalStorage.removeItem("github-token")
    setToken("")
    setError("")
    setUseAuthToken(false)
    setGithubToken("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#262626] border-[#3e3e3e] text-neutral-300 rounded-3xl outline outline-offset-4 outline-white/10">
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
                className="bg-[#1e1e1e] border-[#3e3e3e] text-neutral-300 pb-2"
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

          <div className="bg- [#1e1e1e] p-3 rounded-md border-2 border-dashed border-[#3e3e3e] text-sm space-y-2">
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
            className="w-full sm:w-auto border-[#3e3e3e] text-neutral-300 hover:bg-transparent hover:text-neutral-300"
          >
            Clear Token
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto bg-[#3e3e3e] hover:bg-[#4e4e4e] text-neutral-300">
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
