export async function fetchRawContent(repoUrl: string, path: string, githubToken?: string) {
  if (!repoUrl || !path) {
    throw new Error('Repository URL and path are required');
  }

  console.log(path)

  const response = await fetch(`/api/github/raw?repoUrl=${repoUrl}&path=${path}&githubToken=${githubToken ? githubToken : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch raw content');
  }

  const content = await response.json();
  console.log(content)
  return { path, content };
} 