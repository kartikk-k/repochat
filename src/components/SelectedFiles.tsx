import { File, Folder } from 'lucide-react'

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
    // Group files by directory
    const groupedFiles = selectedItems.filter(item => item.type === 'file').reduce((acc: { [key: string]: FileItem[] }, item) => {
        const parts = item.path.split('/')
        const directory = parts.length > 1 ? parts.slice(0, -1).join('/') : ''
        const fileName = parts[parts.length - 1]

        if (!acc[directory]) {
            acc[directory] = []
        }
        acc[directory].push(item)
        return acc
    }, {})

    if (selectedItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <svg className="opacity-30 size-8 mb-4 text-foreground" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>folder-5</title><g fill="currentColor"><path d="M2.5,7.75H1V3.75c0-.965,.785-1.75,1.75-1.75h3.797c.505,0,.986,.218,1.318,.599l2.324,2.657-1.129,.987-2.325-2.658c-.048-.055-.116-.085-.188-.085H2.75c-.138,0-.25,.112-.25,.25V7.75Z"></path><path d="M14.25,16H3.75c-1.517,0-2.75-1.233-2.75-2.75V7.75c0-1.517,1.233-2.75,2.75-2.75H14.25c1.517,0,2.75,1.233,2.75,2.75v5.5c0,1.517-1.233,2.75-2.75,2.75Z"></path></g></svg>
                <p className="text-sm opacity-70">No files selected</p>
                <p className="text-xs mt-1 opacity-50">Select files from the explorer</p>
            </div>
        )
    }

    return (
        <div className="p-6 px-10 h-full overflow-y-auto">
            <div className="space-y-6">
                {/* Root files */}
                {groupedFiles[''] && (
                    <div>
                        <div className="flex items-center gap-2 mb-2 bg-white/10 p-2 rounded-lg">
                            <svg className='opacity-50 text-foreground' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>folder</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="m.75,7.25V3.25c0-1.105.895-2,2-2h1.701c.607,0,1.18.275,1.56.748l.603.752h2.636c1.105,0,2,.895,2,2v2.5"></path><path d="m2.75,5.25h6.5c1.105,0,2,.895,2,2v1.5c0,1.105-.895,2-2,2H2.75c-1.105,0-2-.895-2-2v-1.5c0-1.105.895-2,2-2Z"></path></g></svg>
                            <h3 className="text-sm font-medium text-white/80">/</h3>
                        </div>
                        <div className="space-y-1 pl-6 grid grid-cols-3 gap-2">
                            {groupedFiles[''].map((item) => (
                                <div key={item.path} className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors border p-3 border-white/10 rounded-lg">
                                    <svg className='opacity-50 text-foreground' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>file</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="m6.75,4.25h3.5c0-.321-.127-.627-.353-.853l-2.295-2.295c-.226-.226-.532-.353-.851-.353v3.5Z" fill="currentColor" stroke-width="0"></path><polyline points="6.75 .75 6.75 4.25 10.25 4.25"></polyline><path d="m7.603,1.103l2.294,2.294c.226.226.353.532.353.852v5.001c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V2.75C1.75,1.645,2.645.75,3.75.75h3.001c.32,0,.626.127.852.353Z"></path></g></svg>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grouped files */}
                {Object.entries(groupedFiles)
                    .filter(([dir]) => dir !== '')
                    .map(([directory, files]) => (
                        <div key={directory}>
                            <div className="flex items-center gap-2 mb-2 bg-white/10 p-2 rounded-lg">
                                <svg className='opacity-50 text-foreground' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>folder</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="m.75,7.25V3.25c0-1.105.895-2,2-2h1.701c.607,0,1.18.275,1.56.748l.603.752h2.636c1.105,0,2,.895,2,2v2.5"></path><path d="m2.75,5.25h6.5c1.105,0,2,.895,2,2v1.5c0,1.105-.895,2-2,2H2.75c-1.105,0-2-.895-2-2v-1.5c0-1.105.895-2,2-2Z"></path></g></svg>
                                <h3 className="text-sm font-medium text-white/80">{directory}</h3>
                            </div>
                            <div className="space-y-1 pl-6 grid grid-cols-3 gap-2">
                                {files.map((item) => (
                                    <div key={item.path} className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors border p-3 border-white/10 rounded-lg">
                                        <svg className='opacity-50 text-foreground' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>file</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="m6.75,4.25h3.5c0-.321-.127-.627-.353-.853l-2.295-2.295c-.226-.226-.532-.353-.851-.353v3.5Z" fill="currentColor" stroke-width="0"></path><polyline points="6.75 .75 6.75 4.25 10.25 4.25"></polyline><path d="m7.603,1.103l2.294,2.294c.226.226.353.532.353.852v5.001c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V2.75C1.75,1.645,2.645.75,3.75.75h3.001c.32,0,.626.127.852.353Z"></path></g></svg>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
} 