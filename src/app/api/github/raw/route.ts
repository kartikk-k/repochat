import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const repoUrl = searchParams.get('repoUrl')

    const path = searchParams.get('path')
    const token = searchParams.get('githubToken')

    if (!repoUrl || !path) {
        return NextResponse.json({ error: 'Repository URL and path are required' }, { status: 400 })
    }

    const [owner, repo] = repoUrl.split('/github.com/')[1].split('/').splice(0, 2)
    const headers: HeadersInit = {
        'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
    }

    if (token) {
        headers['Authorization'] = `token ${token}`
    }
    try {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`
        console.log(url)
        const response = await fetch(url, {
            headers
        })

        const content = await response.text()

        console.log(content)
        return NextResponse.json(content)

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch raw content' }, { status: 500 })
    }



}