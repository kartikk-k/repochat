import { create } from 'zustand'

interface StoreState {
    selectedItems: FileItem[]
    isDialogOpen: boolean
    useAuthToken: boolean
    repoUrl: string
    isLoading: boolean
    error: string | null
    fileData: FileItem[]
    githubToken: string
    setSelectedItems: (items: FileItem[]) => void
    setIsDialogOpen: (isOpen: boolean) => void
    setUseAuthToken: (useToken: boolean) => void
    setRepoUrl: (url: string) => void
    setIsLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setFileData: (data: FileItem[]) => void
    setGithubToken: (token: string) => void
    handleSelect: (item: FileItem, isSelected: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
    selectedItems: [],
    isDialogOpen: false,
    useAuthToken: false,
    repoUrl: '',
    isLoading: false,
    error: null,
    fileData: [],
    githubToken: typeof window !== 'undefined' ? localStorage.getItem('github-token') || '' : '',
    setSelectedItems: (items) => set({ selectedItems: items }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setUseAuthToken: (useToken) => set({ useAuthToken: useToken }),
    setRepoUrl: (url) => set({ repoUrl: url }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setFileData: (data) => set({ fileData: data }),
    setGithubToken: (token) => set({ githubToken: token }),
    handleSelect: (item, isSelected) =>
        set((state) => ({
            selectedItems: isSelected
                ? [...state.selectedItems, item]
                : state.selectedItems.filter(selectedItem => selectedItem.path !== item.path)
        }))
})) 