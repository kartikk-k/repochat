export async function fetchRepositoryContents(repoUrl: string, githubToken?: string) {
  if (!repoUrl) {
    throw new Error('Repository URL is required');
  }

  // Extract owner and repo from URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  const [, owner, repo] = match;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  // Fetch repository tree
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch repository data');
  }

  let structure: FileItem[] = [{ name: 'root', path: '', type: 'dir', children: [] }];

  // Helper function to find or create nested directories
  function findOrCreateDirectory(path: string, parent: FileItem): FileItem {
    if (!path) return parent;
    
    const parts = path.split('/');
    const currentDir = parts[0];
    const remainingPath = parts.slice(1).join('/');
    
    if (parent.type !== 'dir') {
      throw new Error('Parent must be a directory');
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
        if (parentDir.type !== 'dir') {
          throw new Error('Parent must be a directory');
        }
        parentDir.children.push({
          name: fileName,
          path: item.path,
          type: 'file',
          size: item.size,
        });
      } else {
        if (structure[0].type !== 'dir') {
          throw new Error('Root must be a directory');
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

  return structure;
} 