export function parseLocalFiles(files: FileList | File[]) {
  const root: FileItem = { name: 'root', path: '', type: 'dir', children: [] };
  const fileMap: Record<string, File> = {};
  const fileArray = Array.from(files as any);
  for (const file of fileArray) {
    const relativePath = (file as any).webkitRelativePath || file.name;
    fileMap[relativePath] = file;
    const parts = relativePath.split('/');
    const fileName = parts.pop() as string;
    let current = root;
    for (const part of parts) {
      let dir = current.children.find(c => c.name === part && c.type === 'dir') as FileItem | undefined;
      if (!dir) {
        dir = { name: part, path: current.path ? `${current.path}/${part}` : part, type: 'dir', children: [] };
        current.children.push(dir);
      }
      current = dir;
    }
    current.children.push({ name: fileName, path: relativePath, type: 'file', size: file.size });
  }
  return { structure: [root], fileMap };
}

