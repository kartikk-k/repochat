"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronDown } from "lucide-react"

type FileItem = {
    name: string
    path: string
    type: "file" | "dir"
    children?: FileItem[]
}

interface FileExplorerProps {
    data: FileItem[]
    onSelect: (path: string, isSelected: boolean) => void
    selectedItems: string[]
    onLoadDirectory?: (path: string) => Promise<FileItem[]>
}

export function FileExplorer({ data, onSelect, selectedItems, onLoadDirectory }: FileExplorerProps) {
    return (
        <div className="p-2 space-y-1">
            {data.map((item) => (
                <FileExplorerItem
                    key={item.path}
                    item={item}
                    onSelect={onSelect}
                    isSelected={selectedItems.includes(item.path)}
                    selectedItems={selectedItems}
                    onLoadDirectory={onLoadDirectory}
                />
            ))}
        </div>
    )
}

interface FileExplorerItemProps {
    item: FileItem
    onSelect: (path: string, isSelected: boolean) => void
    isSelected: boolean
    selectedItems: string[]
    level?: number
    onLoadDirectory?: (path: string) => Promise<FileItem[]>
}

function FileExplorerItem({ item, onSelect, isSelected, selectedItems, level = 0, onLoadDirectory }: FileExplorerItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [children, setChildren] = useState<FileItem[]>(item.children || [])

    useEffect(() => {
        if (item.type === "dir" && item.children) {
            setChildren(item.children)
        }
    }, [item])

    const handleToggle = () => {
        if (item.type === "dir") {
            setIsExpanded(!isExpanded)
        }
    }

    // Get all child paths recursively
    const getAllChildPaths = (item: FileItem): string[] => {
        let paths: string[] = [item.path]

        if (item.type === "dir" && item.children) {
            item.children.forEach((child) => {
                paths = [...paths, ...getAllChildPaths(child)]
            })
        }

        return paths
    }

    const areAllChildrenSelected = (item: FileItem): boolean => {
        if (!item.children) return false

        let allSelected = true
        item.children.forEach((child) => {
            if(allSelected === false) return false
            if (child.type === "file") {
                if (!selectedItems.includes(child.path)) {
                    allSelected = false
                }
            } else {
                if (!areAllChildrenSelected(child)) {
                    allSelected = false
                }
            }
        })
        return allSelected
    }

    const handleCheckboxChange = (checked: boolean) => {
        // If it's a directory, select/deselect all children
        if (item.type === "dir" && children) {
            const allPaths = getAllChildPaths(item)
            allPaths.forEach(path => {
                onSelect(path, checked)
            })
        } else {
            // For files, just toggle the selection
            onSelect(item.path, checked)
        }
    }

    return (
        <div className="select-none">
            <div
                className={`flex items-center py-1 px-1 hover:bg-[#333333] rounded-sm ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'} duration-200`}
                style={{ paddingLeft: `${level * 16}px` }}
            >
                {item.type === "dir" ? (
                    <button onClick={handleToggle} className="mr-1 text-white/30 focus:outline-none">
                        {isLoading ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                ) : (
                    <div className="w-5"></div>
                )}

                <Checkbox
                    checked={item.type === "dir" ? areAllChildrenSelected(item) : isSelected}
                    onCheckedChange={handleCheckboxChange}
                    className="mr-2 data-[state=checked]:bg-[#A6EBA1]/10 data-[state=checked]:border-[#A6EBA1]/10 border-white/20"
                />

                <span className="flex items-center gap-2">
                    {item.type === "dir" ? (
                        <svg className="opacity-70" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>folder-5</title><g fill="#F7F7F7"><path d="M2.5,7.75H1V3.75c0-.965,.785-1.75,1.75-1.75h3.797c.505,0,.986,.218,1.318,.599l2.324,2.657-1.129,.987-2.325-2.658c-.048-.055-.116-.085-.188-.085H2.75c-.138,0-.25,.112-.25,.25V7.75Z"></path><path d="M14.25,16H3.75c-1.517,0-2.75-1.233-2.75-2.75V7.75c0-1.517,1.233-2.75,2.75-2.75H14.25c1.517,0,2.75,1.233,2.75,2.75v5.5c0,1.517-1.233,2.75-2.75,2.75Z"></path></g></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>file</title><g fill="#F7F7F7"><path d="M15.487 5.427L11.572 1.512C11.2442 1.1841 10.7996 1 10.336 1H4.75C3.2312 1 2 2.2312 2 3.75V14.25C2 15.7688 3.2312 17 4.75 17H13.25C14.7688 17 16 15.7688 16 14.25V6.6655C16 6.2009 15.8155 5.7553 15.487 5.427Z" fill-opacity="0.4"></path> <path d="M15.8691 6.00098H12C11.45 6.00098 11 5.55098 11 5.00098V1.13101C11.212 1.21806 11.4068 1.34677 11.572 1.512L15.487 5.427C15.6527 5.59266 15.7818 5.7882 15.8691 6.00098Z"></path></g></svg>
                    )}
                    <span className="text-sm text-white/80">{item.name}</span>
                </span>
            </div>

            {isExpanded && children && children.length > 0 && (
                <div>
                    {children.map((child) => (
                        <FileExplorerItem
                            key={child.path}
                            item={child}
                            onSelect={onSelect}
                            isSelected={selectedItems.includes(child.path)}
                            selectedItems={selectedItems}
                            level={level + 1}
                            onLoadDirectory={onLoadDirectory}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
