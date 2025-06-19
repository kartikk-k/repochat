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
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="size-[18px]" viewBox="0 0 12 12"><title>file</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="m6.75,4.25h3.5c0-.321-.127-.627-.353-.853l-2.295-2.295c-.226-.226-.532-.353-.851-.353v3.5Z" fill="currentColor" stroke-width="0"></path><polyline points="6.75 .75 6.75 4.25 10.25 4.25"></polyline><path d="m7.603,1.103l2.294,2.294c.226.226.353.532.353.852v5.001c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V2.75C1.75,1.645,2.645.75,3.75.75h3.001c.32,0,.626.127.852.353Z"></path></g></svg>
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
