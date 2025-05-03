import { NextResponse } from 'next/server'

const GITHUB_API_BASE = 'https://api.github.com'

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
        if (path) {
            // Fetch specific file content
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
                { headers }
            )
            const data = await response.json()
            return NextResponse.json(data)
        } else {
            // Fetch repository contents
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`,
                { headers }
            )
            const data = await response.json()
            return NextResponse.json(data)
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 500 })
    }
} 