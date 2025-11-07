"use client"

import { useState, useEffect } from 'react'

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  // Add keyboard listener for '?' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.stopPropagation();
        e.preventDefault()
        setIsOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault()
        setIsOpen(false)
        document.getElementById('keyboard-shortcuts-help-button')?.blur();
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const shortcuts = [
    { keys: ['Ctrl', 'C'], description: 'Copy selected content to clipboard' },
    { keys: ['Ctrl', 'A'], description: 'Select all files' },
    { keys: ['Esc'], description: 'Deselect all files' },
    { keys: ['Ctrl', 'Shift', 'P'], description: 'Open preview dialog' },
  ]

  return (
    <div>
      <button
        id='keyboard-shortcuts-help-button'
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#686868] hover:text-white/80 transition-colors p-2 rounded-md hover:bg-white/5"
        title="Keyboard shortcuts"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className='size-5' viewBox="0 0 18 18"><title>square-command</title><g fill="currentColor"><path d="M6,11.5c0,.276,.224,.5,.5,.5s.5-.224,.5-.5v-.5h-.5c-.276,0-.5,.224-.5,.5Z"></path><path d="M7,6.5c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5,.224,.5,.5,.5h.5v-.5Z"></path><path d="M13.25,2H4.75c-1.517,0-2.75,1.233-2.75,2.75V13.25c0,1.517,1.233,2.75,2.75,2.75H13.25c1.517,0,2.75-1.233,2.75-2.75V4.75c0-1.517-1.233-2.75-2.75-2.75Zm-1.75,7.5c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2v-.5h-1v.5c0,1.103-.897,2-2,2s-2-.897-2-2,.897-2,2-2h.5v-1h-.5c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2v.5h1v-.5c0-1.103,.897-2,2-2s2,.897,2,2-.897,2-2,2h-.5v1h.5Z"></path><path d="M12,6.5c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5v.5h.5c.276,0,.5-.224,.5-.5Z"></path><path d="M11,11.5c0,.276,.224,.5,.5,.5s.5-.224,.5-.5-.224-.5-.5-.5h-.5v.5Z"></path><rect x="8.5" y="8.5" width="1" height="1"></rect></g></svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[#2e2e2e] rounded-xl max-w-md w-full mx-4 outline outline-white/10 overflow-hidden outline-offset-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 pt-2">
              <h2 className="text-white font-medium flex items-center gap-2 text-sm">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className='size-4' width="18" height="18" viewBox="0 0 18 18"><title>xmark</title><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"><line x1="14" y1="4" x2="4" y2="14"></line><line x1="4" y1="4" x2="14" y2="14"></line></g></svg>
              </button>
            </div>

            <hr className='opacity-15 mt-2' />

            <div className="space-y-0 px-3 pb-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-white/70 text-sm">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <div key={keyIndex} className="flex items-center gap-1">
                        <kbd className="px-2 py-1 text-xs font-medium text-white bg-white/10 rounded-md">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="text-white/40 text-xs font-semibold px-0.5">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* <hr className='opacity-15 mt-2' /> */}

            <div className="bg-white/10 h-7 flex items-center justify-center">
              <p className="text-white/50 text-xs text-center font-medium">
                Press <kbd className="px-1.5 py-0.5 mx-1 text-xs font-semibold text-white/70 bg-black/40 rounded-sm">?</kbd> to toggle this dialog
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
