import { NextResponse } from 'next/server'

const GITHUB_API_BASE = 'https://api.github.com'

type FileItem = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size?: number;
    children?: FileItem[];
}

// https://api.github.com/repos/kartikk-k/aura-checker/git/trees/HEAD?recursive=1

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const repoUrl = searchParams.get('repoUrl')
    const path = searchParams.get('path')
    const token = searchParams.get('token')

    if (!repoUrl) {
        return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 })
    }

    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
        return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 })
    }

    const [, owner, repo] = match
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    }

    if (token) {
        headers['Authorization'] = `token ${token}`
    }

    try {

        // Fetch specific file content
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
            { headers }
        )

        const data = await response.json() as { sha: string, url: string, tree: { path: string, type: string, size: number, url: string }[] }

        let structure: FileItem[] = [{ name: 'root', path: '', type: 'dir', children: [] }]

        // Helper function to find or create nested directories
        function findOrCreateDirectory(path: string, parent: FileItem): FileItem {
            if (!path) return parent;
            
            const parts = path.split('/');
            const currentDir = parts[0];
            const remainingPath = parts.slice(1).join('/');
            
            if (!parent.children) {
                parent.children = [];
            }
            
            let dir = parent.children.find(child => child.name === currentDir && child.type === 'dir');
            
            if (!dir) {
                dir = {
                    name: currentDir,
                    path: parent.path ? `${parent.path}/${currentDir}` : currentDir,
                    type: 'dir',
                    children: []
                };
                parent.children.push(dir);
            }
            
            return remainingPath ? findOrCreateDirectory(remainingPath, dir) : dir;
        }

        for (const item of data.tree) {
            if (item.type === 'blob') { // file
                if (item.path.includes('/')) {
                    const dirParts = item.path.split('/');
                    const fileName = dirParts.pop()!;
                    const dirPath = dirParts.join('/');
                    
                    const parentDir = findOrCreateDirectory(dirPath, structure[0]);
                    if (!parentDir.children) {
                        parentDir.children = [];
                    }
                    parentDir.children.push({
                        name: fileName,
                        path: item.path,
                        type: 'file',
                        size: item.size,
                    });
                } else {
                    if (!structure[0].children) {
                        structure[0].children = [];
                    }
                    structure[0].children.push({
                        name: item.path,
                        path: item.path,
                        type: 'file',
                        size: item.size,
                    });
                }
            }
        }
        return NextResponse.json(structure)

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 500 })
    }
} 