"use client"

import { GitHubTokenDialog } from '@/components/APIKeyDialog'
import { PromptPreviewDialog } from '@/components/PromptPreviewDialog'
import { FileExplorer } from '@/components/FileExplorer'
import { SelectedFiles } from '@/components/SelectedFiles'
import getFolderStructure from '@/helpers/GetFolderStructure'
import { fetchRepositoryContents } from '@/helpers/github'
import { fetchRawContent } from '@/helpers/githubRaw'
import { parseLocalFiles } from '@/helpers/parseLocalFiles'
import { useStore } from '@/store/useStore'
import React, { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { Toaster, toast } from 'sonner'


const notAllowedExtensions = ['png', 'jpg', 'ico', 'jpeg', 'webp', 'mp3', 'mp4']

function page() {
  const { selectedItems, isDialogOpen, useAuthToken, repoContent, setRepoContent, addRepoContent, repoUrl, isLoading, error, fileData, githubToken, localFiles, prompt, isPromptDialogOpen, setPrompt, setIsPromptDialogOpen, setSelectedItems, setIsDialogOpen, setUseAuthToken, setRepoUrl, setIsLoading, setError, setFileData, setLocalFiles, setGithubToken, handleSelect }
    = useStore()

  const [fetchingContent, setFetchingContent] = useState(false)
  const folderInputRef = React.useRef<HTMLInputElement>(null)

  // Load token from localStorage on component mount
  React.useEffect(() => {
    const savedToken = localStorage.getItem('github-token')
    if (savedToken) {
      setGithubToken(savedToken)
    }
  }, [setGithubToken, setUseAuthToken])

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const { structure, fileMap } = parseLocalFiles(files)
    setFileData(structure)
    setLocalFiles(fileMap)
    setRepoUrl('')
    setSelectedItems([])
    setRepoContent([])
  }

  const handleFetch = async () => {
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contents = await fetchRepositoryContents(repoUrl, useAuthToken ? githubToken : undefined);
      setFileData(contents.filter((i) => i.type === 'dir' || i.type === 'file'));
      // reset selected items and repo content
      setSelectedItems([])
      setRepoContent([])

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSave = (token: string) => {
    localStorage.setItem('github-token', token)
    setGithubToken(token)
    setUseAuthToken(true)
    setIsDialogOpen(false)
  };

  useEffect(() => {
    if (!selectedItems.length) return
    handleSelectedItemsChange()
  }, [selectedItems])

  const handleSelectedItemsChange = async () => {
    if (!selectedItems.length) return;

    const availableRawContent = repoContent.flatMap(item => item.path);
    const pathWithoutRawContent = selectedItems
      .filter(item => item.type === 'file')
      .filter(item => !notAllowedExtensions.includes(item.path.split('.').pop() || ''))
      .filter(item => !availableRawContent.includes(item.path))
      .map(item => item.path);

    setFetchingContent(true);

    try {
      if (repoUrl) {
        // Process files in batches of 5
        for (let i = 0; i < pathWithoutRawContent.length; i += 5) {
          const batch = pathWithoutRawContent.slice(i, i + 5);
          const promises = batch.map(async (path) => {
            try {
              const { path: filePath, content } = await fetchRawContent(repoUrl, path, useAuthToken ? githubToken : undefined);
              addRepoContent({ path: filePath, content });
            } catch (error) {
              console.error(`Error fetching raw content for path ${path}:`, error);
            }
          });
          await Promise.all(promises);
        }
      } else {
        for (const path of pathWithoutRawContent) {
          const file = localFiles[path];
          if (!file) continue;
          const content = await file.text();
          addRepoContent({ path, content });
        }
      }
    } catch (error) {
      console.error('Error fetching raw content:', error);
    } finally {
      setFetchingContent(false);
    }
  };

  const handleUseToken = () => {
    if (!githubToken) {
      setIsDialogOpen(true)
    } else {
      setUseAuthToken(!useAuthToken)
    }
  }

  const generatePrompt = () => {
    const tree = getFolderStructure()

    const filesContent = selectedItems
      .filter(item => !notAllowedExtensions.includes(item.path.split('.').pop() || ''))
      .filter(item => item.type === 'file')
      .map(item => {
        const rawContent = repoContent.find(i => i.path === item.path)?.content
        if (!rawContent) return ''
        return `### FILE: ${item.path}\n\u0060\u0060\u0060\n${rawContent}\n\u0060\u0060\u0060\n`
      })
      .join('\n')

    return [
      '## PROJECT TREE',
      tree,
      '## FILE CONTENTS',
      filesContent,
    ].join('\n')
  }

  const handlePreview = () => {
    if (!selectedItems.length) return
    const content = generatePrompt()
    setPrompt(content)
    setIsPromptDialogOpen(true)
  }

  const handleCopyContent = () => {
    if (!selectedItems.length) return
    const content = prompt || generatePrompt()
    setPrompt(content)
    navigator.clipboard.writeText(content)
    toast.custom((t) => (
      <div className={`${t} flex flex-col bg-[#31392f] text-[#A6EBA1] font-medium rounded-xl px-4 justify-center h-[64px] min-w-[250px] outline outline-[#A6EBA1]/20 outline-offset-4`}>
        <p>Prompt copied</p>
        <p className='text-sm opacity-70'>Copied to clipboard, paste it in your favorite app</p>
      </div>
    ), {
      duration: 3000,
      position: 'top-right',
    })
  }

  return (
    <div className='min-h-screen bg-[#121212] flex flex-col items-center justify-center px-10'>
      <div className='flex items-center justify-center h-[650px] outline-2 outline-white/15 outline-offset-4 rounded-2xl w-full max-w-[1200px] overflow-hidden relative'>
        {/* sidebar */}
        <div className='w-[280px] bg-[#262626] h-full rounded-l-2xl relative'>
          <div className='py-10 h-full overflow-y-auto'>
            <FileExplorer
              data={fileData}
              onSelect={handleSelect}
              selectedItems={selectedItems}
            />
          </div>

          <div className='flex items-center gap-2 absolute top-4 left-4'>
            <span className='h-3 w-3 rounded-full border border-white/15' />
            <span className='h-3 w-3 rounded-full border border-white/15' />
            <span className='h-3 w-3 rounded-full border border-white/15' />
          </div>
        </div>

        {/* main */}
        <div className='flex-1 bg-[#1E1E1E] h-full rounded-r-2xl relative'>
          <div className='flex items-center justify-center w-full p-10'>
            <div className='flex items-center gap-1 w-full rounded-full outline outline-white/15 outline-offset-4 focus-within:outline-2 focus-within:outline-white/20 transition-all duration-300'>
              <input
                type="text"
                placeholder='Enter github repo url here...'
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFetch()
                  }
                }}
                className='bg-[#2e2e2e] text-white/80 text-sm font-medium w-full h-11 outline-none rounded-l-full px-5 rounded-rl-2xl'
              />

              <div className='flex items-center gap-1'>
                <button
                  title='Fetch from Github'
                  onClick={handleFetch}
                  disabled={isLoading}
                  className={`text-[#A6EBA1] bg-[#31392f] font-semibold text-sm outline-none w-28 h-11 flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>plug-2</title><g fill="currentColor"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.35528 8.46328C4.67183 7.77848 3.56372 7.77958 2.88033 8.46298C1.04246 10.3009 1.04178 13.2824 2.87967 15.1203C4.71756 16.9582 7.69841 16.9582 9.53631 15.1203C10.2211 14.4369 10.2204 13.3284 9.53699 12.645L5.35528 8.46328Z"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7803 1.21967C17.0732 1.51256 17.0732 1.98744 16.7803 2.28033L15.6086 3.45203C16.9405 5.29199 16.7777 7.87891 15.1203 9.53631C14.4322 10.1368 13.3829 10.1082 12.7283 9.45365L8.54706 5.27232C7.89086 4.61741 7.86338 3.56763 8.4637 2.87964C10.1211 1.22223 12.708 1.05947 14.548 2.39136L15.7197 1.21967C16.0126 0.926777 16.4874 0.926777 16.7803 1.21967Z" fill-opacity="0.4"></path> <path d="M2.39136 14.548C2.53639 14.7483 2.69915 14.9398 2.87963 15.1203C3.06013 15.3008 3.25165 15.4636 3.45202 15.6086L2.28033 16.7803C1.98744 17.0732 1.51256 17.0732 1.21967 16.7803C0.926777 16.4874 0.926777 16.0126 1.21967 15.7197L2.39136 14.548Z"></path> <path d="M9.22631 12.3343L8.16565 11.2737L9.46962 9.96967C9.76251 9.67678 10.2374 9.67678 10.5303 9.96967C10.8232 10.2626 10.8232 10.7374 10.5303 11.0303L9.22631 12.3343Z"></path> <path d="M8.0303 7.46967C8.32319 7.76257 8.32319 8.23744 8.03029 8.53033L6.72631 9.83434L5.66565 8.77368L6.96964 7.46967C7.26253 7.17678 7.73741 7.17678 8.0303 7.46967Z"></path> </g></svg>
                      Fetch
                    </>
                  )}
                </button>
                <button
                  title='Upload Folder'
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className='text-[#A6EBA1] bg-[#31392f] px-4 flex items-center justify-center font-semibold text-sm outline-none h-11 rounded-r-full gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>move-obj-up</title><g fill="currentColor"><path opacity="0.4" d="M14.25 12H3.75C2.7835 12 2 12.7835 2 13.75V14.75C2 15.7165 2.7835 16.5 3.75 16.5H14.25C15.2165 16.5 16 15.7165 16 14.75V13.75C16 12.7835 15.2165 12 14.25 12Z"></path> <path d="M6.28 6.03005L8.25 4.06002V9.74905C8.25 10.163 8.586 10.499 9 10.499C9.414 10.499 9.75 10.163 9.75 9.74905V4.061L11.72 6.03103C11.866 6.17703 12.058 6.251 12.25 6.251C12.442 6.251 12.634 6.17803 12.78 6.03103C13.073 5.73803 13.073 5.26299 12.78 4.96999L9.53 1.71999C9.237 1.42699 8.762 1.42699 8.469 1.71999L5.219 4.96999C4.926 5.26299 4.926 5.73803 5.219 6.03103C5.512 6.32403 5.987 6.32305 6.28 6.03005Z"></path></g></svg>
                </button>
              </div>

              <input
                ref={folderInputRef}
                type="file"
                multiple
                className='hidden'
                onChange={handleFolderChange}
                {...{ webkitdirectory: 'true', directory: '' }}
              />
            </div>
          </div>

          {error && (
            <div className="px-10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className='h-full flex-1 overflow-y-auto pb-[200px]'>
            <SelectedFiles selectedItems={selectedItems} />
          </div>

          <div className='absolute bottom-0 left-0 right-0 flex items-start justify-between px-10 py-2 bg-[#1E1E1E]'>

            <div className='flex gap-1'>
              <button
                onClick={handlePreview}
                disabled={!selectedItems.length}
                className={` text-white/60 disabled:opacity-60 bg-[#2e2e2e] rounded-l-4xl rounded-r-sm h-10 w-[148px] font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300`}
              >
                <Eye className='h-4 w-4' />
                Preview
              </button>
              <button
                onClick={handleCopyContent}
                disabled={!selectedItems.length}
                className={` text-white/60 disabled:opacity-60 bg-[#2e2e2e] rounded-r-4xl rounded-l-sm h-10 w-[148px] font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300`}
              >
                {fetchingContent ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>clone</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M10.75 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V10.75C1.75 11.8546 2.64543 12.75 3.75 12.75H10.75C11.8546 12.75 12.75 11.8546 12.75 10.75V3.75C12.75 2.64543 11.8546 1.75 10.75 1.75Z" fill="currentColor" fill-opacity="0.3" data-stroke="none" stroke="none"></path> <path d="M10.75 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V10.75C1.75 11.8546 2.64543 12.75 3.75 12.75H10.75C11.8546 12.75 12.75 11.8546 12.75 10.75V3.75C12.75 2.64543 11.8546 1.75 10.75 1.75Z"></path> <path d="M15 5.39499C15.733 5.69199 16.25 6.40999 16.25 7.24999V14.25C16.25 15.355 15.355 16.25 14.25 16.25H7.25002C6.41102 16.25 5.69202 15.733 5.39502 15"></path></g></svg>
                    Copy content
                  </>
                )}
              </button>
            </div>

            <div className='flex flex-col items-center'>
              <div className='flex items-center gap-1'>
                <button
                  onClick={handleUseToken}
                  className={`${useAuthToken ? 'bg-[#31392f] text-[#A6EBA1]' : 'bg-[#2e2e2e] text-white/80'} rounded-l-full h-10 px-4 font-medium text-sm flex items-center gap-2 transition-all duration-300`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>user-key</title><g fill="currentColor"><path d="M9 7.00049C10.6571 7.00049 12 5.65736 12 4.00049C12 2.34362 10.6571 1.00049 9 1.00049C7.34291 1.00049 6 2.34362 6 4.00049C6 5.65736 7.34291 7.00049 9 7.00049Z" fill-opacity="0.4"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 14.25C8.5 12.7312 9.73119 11.5 11.25 11.5C12.5088 11.5 13.57 12.3457 13.8965 13.5H17.25C17.6642 13.5 18 13.8358 18 14.25C18 14.6642 17.6642 15 17.25 15H16.5V15.75C16.5 16.1642 16.1642 16.5 15.75 16.5C15.3358 16.5 15 16.1642 15 15.75V15H13.8965C13.57 16.1543 12.5088 17 11.25 17C9.73119 17 8.5 15.7688 8.5 14.25ZM11.25 13C10.5596 13 10 13.5596 10 14.25C10 14.9404 10.5596 15.5 11.25 15.5C11.9404 15.5 12.5 14.9404 12.5 14.25C12.5 13.5596 11.9404 13 11.25 13Z"></path> <path d="M8.99999 8.50049C6.14167 8.50049 3.69058 10.2162 2.60517 12.6679C2.05162 13.9191 2.74425 15.3322 4.01259 15.7318C4.98685 16.0388 6.20082 16.323 7.60804 16.4418C7.22206 15.8019 7 15.0519 7 14.25C7 11.9028 8.90275 10 11.25 10C11.8742 10 12.4665 10.1344 13 10.3758V9.75882C11.8675 8.9661 10.489 8.50049 8.99999 8.50049Z" fill-opacity="0.4"></path></g></svg>
                  Use Token
                </button>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className={`${useAuthToken ? 'bg-[#31392f] text-[#A6EBA1]' : 'bg-[#2e2e2e] text-white/80'} rounded-r-full h-10 px-4 font-semibold text-sm transition-all duration-300`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>dots</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><path d="M9 9.5C9.27614 9.5 9.5 9.27614 9.5 9C9.5 8.72386 9.27614 8.5 9 8.5C8.72386 8.5 8.5 8.72386 8.5 9C8.5 9.27614 8.72386 9.5 9 9.5Z" fill="currentColor"></path> <path d="M3.25 9.5C3.52614 9.5 3.75 9.27614 3.75 9C3.75 8.72386 3.52614 8.5 3.25 8.5C2.97386 8.5 2.75 8.72386 2.75 9C2.75 9.27614 2.97386 9.5 3.25 9.5Z" fill="currentColor"></path> <path d="M14.75 9.5C15.0261 9.5 15.25 9.27614 15.25 9C15.25 8.72386 15.0261 8.5 14.75 8.5C14.4739 8.5 14.25 8.72386 14.25 9C14.25 9.27614 14.4739 9.5 14.75 9.5Z" fill="currentColor"></path></g></svg>
                </button>
              </div>
              <span className='text-white/50 text-xs mt-1'>Click to toggle</span>
            </div>
          </div>

        </div>

        {/* fixed */}
        <GitHubTokenDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleTokenSave}
        />
        <PromptPreviewDialog
          isOpen={isPromptDialogOpen}
          onClose={() => setIsPromptDialogOpen(false)}
        />

        <Toaster />
      </div>
    </div>
  )
}

export default page