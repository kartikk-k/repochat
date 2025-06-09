import { create } from 'zustand'

interface StoreState {
    repoUrl: string
    setRepoUrl: (url: string) => void
    selectedItems: FileItem[]
    setSelectedItems: (items: FileItem[]) => void

    repoContent: { path: string, content: string }[]
    setRepoContent: (content: { path: string, content: string }[]) => void
    addRepoContent: (content: { path: string, content: string }) => void

    githubToken: string
    setGithubToken: (token: string) => void
    useAuthToken: boolean
    setUseAuthToken: (useToken: boolean) => void
    isDialogOpen: boolean
    setIsDialogOpen: (isOpen: boolean) => void

    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    error: string | null
    setError: (error: string | null) => void
    fileData: FileItem[]
    setFileData: (data: FileItem[]) => void

    localFiles: Record<string, File>
    setLocalFiles: (files: Record<string, File>) => void

    handleSelect: (item: FileItem, isSelected: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
    selectedItems: [],
    isDialogOpen: false,
    useAuthToken: false,
    repoUrl: 'https://github.com/kartikk-k/repochat',
    isLoading: false,
    error: null,
    fileData: [],
    localFiles: {},
    repoContent: [],

    githubToken: typeof window !== 'undefined' ? localStorage.getItem('github-token') || '' : '',
    setSelectedItems: (items) => set({ selectedItems: items }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setUseAuthToken: (useToken) => set({ useAuthToken: useToken }),
    setRepoUrl: (url) => set({ repoUrl: url }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setFileData: (data) => set({ fileData: data }),
    setLocalFiles: (files) => set({ localFiles: files }),
    setGithubToken: (token) => set({ githubToken: token }),
    setRepoContent: (content) => set({ repoContent: content }),

    addRepoContent: (content) => set((state) => ({
        repoContent: state.repoContent.some(item => item.path === content.path)
            ? state.repoContent.map(item => item.path === content.path ? content : item)
            : [...state.repoContent, content]
    })),

    handleSelect: (item, isSelected) =>
        set((state) => ({
            selectedItems: isSelected
                ? [...state.selectedItems, item]
                : state.selectedItems.filter(selectedItem => selectedItem.path !== item.path)
        }))
})) 