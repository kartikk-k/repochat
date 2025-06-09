"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { FileText } from "lucide-react";

interface PromptPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromptPreviewDialog({ isOpen, onClose }: PromptPreviewDialogProps) {
  const { prompt, setPrompt } = useStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl bg-[#262626] border-[#3e3e3e] text-neutral-300 rounded-3xl outline outline-offset-4 outline-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prompt Preview
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Review and edit the generated prompt before copying.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <textarea
            className="bg-[#1e1e1e] border border-[#3e3e3e] text-neutral-300 rounded-md w-full h-64 p-2 text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(prompt);
            }}
            className="w-full sm:w-auto bg-[#3e3e3e] hover:bg-[#4e4e4e] text-neutral-300"
          >
            Copy
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto border-[#3e3e3e] text-neutral-300 hover:bg-transparent hover:text-neutral-300" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
