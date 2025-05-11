export type FileItem = {
    name: string
    path: string
} & ({
    type: "dir"
    children: FileItem[]
} | {
    type: "file"
    size: number
})