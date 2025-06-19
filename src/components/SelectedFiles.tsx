"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useStore } from "@/store/useStore"

type FileItem = {
    name: string
    path: string
    type: "file" | "dir"
    children?: FileItem[]
}

interface SelectedFilesProps {
    selectedItems: FileItem[]
}

export function SelectedFiles({ selectedItems }: SelectedFilesProps) {
    const { removeSelectedItem } = useStore()

    const fileItems = selectedItems.filter(item => item.type === 'file')

    if (fileItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-app-text-muted">
                <div className="flex items-center justify-center w-16 h-16 bg-app-hover rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="text-app-text-muted">
                        <path fill="currentColor" d="M25.7 9.3l-7-7A.908.908 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.908.908 0 0 0-.3-.7zM18 4.4l5.6 5.6H18zM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6z"/>
                    </svg>
                </div>
                <p className="text-lg font-medium mb-2">No files selected</p>
                <p className="text-sm text-center max-w-md">
                    Select files from the sidebar to see them here. You can then preview or copy the content.
                </p>
            </div>
        )
    }

    return (
        <div className="px-10 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-app-text">
                    Selected Files ({fileItems.length})
                </h2>
                {fileItems.length > 0 && (
                    <button
                        onClick={() => {
                            fileItems.forEach(item => {
                                removeSelectedItem(item.path)
                            })
                        }}
                        className="text-sm text-app-text-muted hover:text-destructive transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid gap-3">
                <AnimatePresence>
                    {fileItems.map((item) => (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center justify-between p-3 bg-app-input rounded-lg border border-app-border hover:border-app-border/60 transition-colors group"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="text-app-text-muted">
                                        <path fill="currentColor" d="M15.487 5.427L11.572 1.512C11.2442 1.1841 10.7996 1 10.336 1H4.75C3.2312 1 2 2.2312 2 3.75V14.25C2 15.7688 3.2312 17 4.75 17H13.25C14.7688 17 16 15.7688 16 14.25V6.6655C16 6.2009 15.8155 5.7553 15.487 5.427Z" fillOpacity="0.4"/>
                                        <path fill="currentColor" d="M15.8691 6.00098H12C11.45 6.00098 11 5.55098 11 5.00098V1.13101C11.212 1.21806 11.4068 1.34677 11.572 1.512L15.487 5.427C15.6527 5.59266 15.7818 5.7882 15.8691 6.00098Z"/>
                                    </svg>
                                </div>
                                
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-app-text truncate">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-app-text-muted truncate">
                                        {item.path}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => removeSelectedItem(item.path)}
                                className="flex-shrink-0 p-1 rounded-md text-app-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove file"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
} 