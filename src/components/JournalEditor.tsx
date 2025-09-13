import React, { useEffect, useRef, useState } from 'react'
import useJournalStore from '@/hooks/useJournalStore'

type Props = {
  date: Date
  onClose: () => void
}

// small helper to sanitize/save HTML (keep simple)
function sanitizeHtml(html: string) {
  // For now, keep as-is; in production, use a sanitizer
  return html
}

export const JournalEditor: React.FC<Props> = ({ date, onClose }) => {
  const store = useJournalStore()
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const autosaveTimer = useRef<number | null>(null)
  const isInitialized = useRef<boolean>(false)

  // Only initialize content once when component mounts or date changes
  useEffect(() => {
    if (!editorRef.current) return
    
    // Load existing content if available
    const entry = store.getEntry(date)
    const existingContent = entry?.content || ''
    
    // Set innerHTML only once per date change
    editorRef.current.innerHTML = existingContent
    isInitialized.current = true
    
    // Focus after content is set
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
      }
    }, 100)
  }, [date, store]) // Re-run when date changes

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    }
  }, [])

  const scheduleAutosave = () => {
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    autosaveTimer.current = window.setTimeout(() => handleSave(), 2000)
  }

  const handleSave = () => {
    if (!editorRef.current) return
    const html = sanitizeHtml(editorRef.current.innerHTML)
    store.saveEntry(date, html)
    setLastSaved(Date.now())
  }

  const handleCancel = () => {
    onClose()
  }

  const onInput = () => {
    if (!editorRef.current || !isInitialized.current) return
    scheduleAutosave()
  }

  const onFocus = () => {
    // Don't interfere with typing
  }

  const onBlur = () => {
    // Don't interfere with typing
  }

  const applyCommand = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    if (editorRef.current) {
      scheduleAutosave()
    }
  }

  const dateLabel = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 20000
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: 'min(900px, 95%)', maxHeight: '90vh', overflow: 'hidden', borderRadius: 12 }}>
        {/* Paper surface */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 12px 40px rgba(2,6,23,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'Georgia, Times, serif', fontSize: 20, fontWeight: 700 }}>{dateLabel}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Not saved yet'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => applyCommand('bold')} style={{ padding: '8px 12px' }}>B</button>
              <button onClick={() => applyCommand('italic')} style={{ padding: '8px 12px' }}>I</button>
              <button onClick={() => applyCommand('underline')} style={{ padding: '8px 12px' }}>U</button>
              <button onClick={() => applyCommand('insertUnorderedList')} style={{ padding: '8px 12px' }}>• List</button>
              <button onClick={() => applyCommand('formatBlock', '<blockquote>')} style={{ padding: '8px 12px' }}>❝ Quote</button>
              <button onClick={() => { handleSave(); onClose() }} style={{ padding: '8px 12px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: 6 }}>Save</button>
              <button onClick={handleCancel} style={{ padding: '8px 12px' }}>Cancel</button>
            </div>
          </div>

          {/* Lined paper area */}
          <div style={{
            background: 'repeating-linear-gradient( to bottom, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 30px )',
            padding: 24,
            borderRadius: 8,
            height: '64vh',
            overflowY: 'auto',
            fontFamily: 'Georgia, Times, serif',
            fontSize: 18,
            lineHeight: '30px',
            color: '#111827',
            boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)',
            position: 'relative'
          }}>
            <div
              ref={editorRef}
              contentEditable
              onInput={onInput}
              onFocus={onFocus}
              onBlur={onBlur}
              data-placeholder="Start writing your thoughts..."
              style={{ 
                outline: 'none', 
                minHeight: '100%', 
                whiteSpace: 'pre-wrap',
                color: '#111827 !important',
                cursor: 'text',
                background: 'transparent',
                fontSize: '18px',
                lineHeight: '30px',
                fontFamily: 'Georgia, Times, serif'
              }}
              suppressContentEditableWarning
            />
            <style dangerouslySetInnerHTML={{
              __html: `
                [contenteditable][data-placeholder]:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                  font-style: italic;
                  pointer-events: none;
                }
                [contenteditable] {
                  color: #111827 !important;
                  font-size: 18px !important;
                  line-height: 30px !important;
                  font-family: Georgia, Times, serif !important;
                }
                [contenteditable] * {
                  color: inherit !important;
                }
              `
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalEditor
