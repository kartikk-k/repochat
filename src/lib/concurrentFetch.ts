import pLimit from 'p-limit';
import { fetchRawContent } from '@/helpers/githubRaw';

const githubLimit = pLimit(20); // Safe for GitHub rate limits

export async function fetchFilesConcurrent(
  paths: string[],
  repoUrl: string,
  token?: string
) {
  const results = await Promise.all(
    paths.map(path =>
      githubLimit(async () => {
        try {
          return await fetchRawContent(repoUrl, path, token);
        } catch (error) {
          console.error(`Failed ${path}:`, error);
          return null;
        }
      })
    )
  );
  return results.filter((r): r is { path: string; content: string } => r !== null);
}
