"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X, ChevronDown, ChevronUp, Sparkles } from "lucide-react"

export interface FilterOptions {
    searchQuery: string
    fileTypes: string[]
    excludePatterns: string[]
    smartSelectPattern?: string
}

interface FilterBarProps {
    onFilterChange: (filters: FilterOptions) => void
    onSmartSelect: (pattern: string) => void
}

const commonFileTypes = [
    { value: "ts", label: ".ts" },
    { value: "tsx", label: ".tsx" },
    { value: "js", label: ".js" },
    { value: "jsx", label: ".jsx" },
    { value: "py", label: ".py" },
    { value: "java", label: ".java" },
    { value: "go", label: ".go" },
    { value: "rs", label: ".rs" },
    { value: "css", label: ".css" },
    { value: "html", label: ".html" },
    { value: "json", label: ".json" },
    { value: "md", label: ".md" },
]

const commonExcludePatterns = [
    { value: "node_modules", label: "node_modules" },
    { value: "build", label: "build" },
    { value: "dist", label: "dist" },
    { value: ".next", label: ".next" },
    { value: "out", label: "out" },
    { value: ".git", label: ".git" },
    { value: "coverage", label: "coverage" },
    { value: "__pycache__", label: "__pycache__" },
    { value: ".venv", label: ".venv" },
    { value: "vendor", label: "vendor" },
]

const smartSelectPatterns = [
    { id: "components", label: "All Components", pattern: "component" },
    { id: "tests", label: "All Tests", pattern: "test|spec" },
    { id: "styles", label: "All Styles", pattern: "css|scss|sass" },
    { id: "config", label: "Config Files", pattern: "config|.config" },
    { id: "pages", label: "Pages/Routes", pattern: "page|route" },
]

export function FilterBar({ onFilterChange, onSmartSelect }: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([])
    const [selectedExcludePatterns, setSelectedExcludePatterns] = useState<string[]>([
        "node_modules",
        ".git",
    ])
    const [showFileTypes, setShowFileTypes] = useState(false)
    const [showExcludePatterns, setShowExcludePatterns] = useState(false)
    const [showSmartSelect, setShowSmartSelect] = useState(false)

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        applyFilters(value, selectedFileTypes, selectedExcludePatterns)
    }

    const handleFileTypeToggle = (type: string) => {
        const newTypes = selectedFileTypes.includes(type)
            ? selectedFileTypes.filter((t) => t !== type)
            : [...selectedFileTypes, type]
        setSelectedFileTypes(newTypes)
        applyFilters(searchQuery, newTypes, selectedExcludePatterns)
    }

    const handleExcludePatternToggle = (pattern: string) => {
        const newPatterns = selectedExcludePatterns.includes(pattern)
            ? selectedExcludePatterns.filter((p) => p !== pattern)
            : [...selectedExcludePatterns, pattern]
        setSelectedExcludePatterns(newPatterns)
        applyFilters(searchQuery, selectedFileTypes, newPatterns)
    }

    const applyFilters = (search: string, types: string[], excludes: string[]) => {
        onFilterChange({
            searchQuery: search,
            fileTypes: types,
            excludePatterns: excludes,
        })
    }

    const clearAllFilters = () => {
        setSearchQuery("")
        setSelectedFileTypes([])
        setSelectedExcludePatterns(["node_modules", ".git"])
        applyFilters("", [], ["node_modules", ".git"])
    }

    const hasActiveFilters = searchQuery || selectedFileTypes.length > 0

    return (
        <div className="p-3 space-y-2 border-b border-white/10">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 pr-9 bg-[#1a1a1a] border-white/10 text-white placeholder:text-white/40 focus:border-[#A6EBA1]/30 focus:ring-[#A6EBA1]/20 h-9"
                />
                {searchQuery && (
                    <button
                        onClick={() => handleSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFileTypes(!showFileTypes)}
                    className="h-7 px-2 text-xs bg-[#1a1a1a] border-white/10 text-white/70 hover:bg-[#2a2a2a] hover:text-white"
                >
                    <Filter className="h-3 w-3 mr-1" />
                    Types {selectedFileTypes.length > 0 && `(${selectedFileTypes.length})`}
                    {showFileTypes ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExcludePatterns(!showExcludePatterns)}
                    className="h-7 px-2 text-xs bg-[#1a1a1a] border-white/10 text-white/70 hover:bg-[#2a2a2a] hover:text-white"
                >
                    Exclude ({selectedExcludePatterns.length})
                    {showExcludePatterns ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSmartSelect(!showSmartSelect)}
                    className="h-7 px-2 text-xs bg-[#1a1a1a] border-white/10 text-white/70 hover:bg-[#2a2a2a] hover:text-white"
                >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart
                    {showSmartSelect ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-7 px-2 text-xs text-white/50 hover:text-white/80 hover:bg-[#2a2a2a] ml-auto"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* File Types Filter */}
            {showFileTypes && (
                <div className="p-3 bg-[#1a1a1a] rounded-md border border-white/10">
                    <div className="text-xs text-white/60 mb-2 font-medium">File Types</div>
                    <div className="grid grid-cols-3 gap-2">
                        {commonFileTypes.map((type) => (
                            <label
                                key={type.value}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-[#2a2a2a] p-1 rounded"
                            >
                                <Checkbox
                                    checked={selectedFileTypes.includes(type.value)}
                                    onCheckedChange={() => handleFileTypeToggle(type.value)}
                                    className="data-[state=checked]:bg-[#A6EBA1]/10 data-[state=checked]:border-[#A6EBA1]/30 border-white/20"
                                />
                                <span className="text-xs text-white/70">{type.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Exclude Patterns */}
            {showExcludePatterns && (
                <div className="p-3 bg-[#1a1a1a] rounded-md border border-white/10">
                    <div className="text-xs text-white/60 mb-2 font-medium">Exclude Patterns</div>
                    <div className="grid grid-cols-2 gap-2">
                        {commonExcludePatterns.map((pattern) => (
                            <label
                                key={pattern.value}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-[#2a2a2a] p-1 rounded"
                            >
                                <Checkbox
                                    checked={selectedExcludePatterns.includes(pattern.value)}
                                    onCheckedChange={() => handleExcludePatternToggle(pattern.value)}
                                    className="data-[state=checked]:bg-[#A6EBA1]/10 data-[state=checked]:border-[#A6EBA1]/30 border-white/20"
                                />
                                <span className="text-xs text-white/70">{pattern.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Smart Select */}
            {showSmartSelect && (
                <div className="p-3 bg-[#1a1a1a] rounded-md border border-white/10">
                    <div className="text-xs text-white/60 mb-2 font-medium">Smart Select</div>
                    <div className="flex flex-wrap gap-2">
                        {smartSelectPatterns.map((smart) => (
                            <Button
                                key={smart.id}
                                variant="outline"
                                size="sm"
                                onClick={() => onSmartSelect(smart.pattern)}
                                className="h-7 px-3 text-xs bg-[#2a2a2a] border-white/10 text-white/70 hover:bg-[#3a3a3a] hover:text-white hover:border-[#A6EBA1]/30"
                            >
                                {smart.label}
                            </Button>
                        ))}
                    </div>
                    <div className="text-xs text-white/40 mt-2">
                        Click to auto-select matching files
                    </div>
                </div>
            )}
        </div>
    )
}
