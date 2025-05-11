export async function fetchRawContent(repoUrl: string, path: string, githubToken?: string) {
  if (!repoUrl || !path) {
    throw new Error('Repository URL and path are required');
  }

  const [owner, repo] = repoUrl.split('/github.com/')[1].split('/').splice(0, 2);
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch raw content');
  }

  const content = await response.text();
  return { path, content };
} 