import { FilterOptions } from "@/components/FilterBar"

/**
 * Filters the file tree based on the provided filter options
 */
export function filterFileTree(
    items: FileItem[],
    filters: FilterOptions
): FileItem[] {
    const { searchQuery, fileTypes, excludePatterns } = filters

    return items
        .map((item) => filterItem(item, searchQuery, fileTypes, excludePatterns))
        .filter((item): item is FileItem => item !== null)
}

function filterItem(
    item: FileItem,
    searchQuery: string,
    fileTypes: string[],
    excludePatterns: string[]
): FileItem | null {
    // Check if item matches exclude patterns
    if (shouldExclude(item, excludePatterns)) {
        return null
    }

    // If it's a directory
    if (item.type === "dir") {
        // Recursively filter children
        const filteredChildren = item.children
            .map((child) => filterItem(child, searchQuery, fileTypes, excludePatterns))
            .filter((child): child is FileItem => child !== null)

        // If directory name matches search or has matching children, include it
        const nameMatches = matchesSearch(item.name, searchQuery)
        if (nameMatches || filteredChildren.length > 0) {
            return {
                ...item,
                type: "dir" as const,
                children: filteredChildren,
            }
        }
        return null
    }

    // If it's a file
    const nameMatches = matchesSearch(item.name, searchQuery)
    const typeMatches = matchesFileType(item.name, fileTypes)

    if (nameMatches && typeMatches) {
        return item
    }

    return null
}

function matchesSearch(name: string, searchQuery: string): boolean {
    if (!searchQuery) return true
    return name.toLowerCase().includes(searchQuery.toLowerCase())
}

function matchesFileType(name: string, fileTypes: string[]): boolean {
    if (fileTypes.length === 0) return true

    const extension = name.split(".").pop()?.toLowerCase()
    if (!extension) return false

    return fileTypes.includes(extension)
}

function shouldExclude(item: FileItem, excludePatterns: string[]): boolean {
    if (excludePatterns.length === 0) return false

    const pathLower = item.path.toLowerCase()
    const nameLower = item.name.toLowerCase()

    return excludePatterns.some((pattern) => {
        const patternLower = pattern.toLowerCase()
        return (
            pathLower.includes(patternLower) ||
            nameLower === patternLower ||
            pathLower.includes(`/${patternLower}/`) ||
            pathLower.endsWith(`/${patternLower}`)
        )
    })
}

/**
 * Finds all files matching a pattern (for smart select)
 */
export function findFilesMatchingPattern(
    items: FileItem[],
    pattern: string
): FileItem[] {
    const results: FileItem[] = []
    const regex = new RegExp(pattern, "i")

    function traverse(item: FileItem) {
        if (item.type === "file") {
            if (regex.test(item.name) || regex.test(item.path)) {
                results.push(item)
            }
        } else {
            // item.type === "dir"
            item.children.forEach(traverse)
        }
    }

    items.forEach(traverse)
    return results
}
