import React, { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import useJournalStore from '@/hooks/useJournalStore'

type Props = {
  date: Date
  entryId?: string | null
  onClose: () => void
}

// small helper to sanitize/save HTML (keep simple)
function sanitizeHtml(html: string) {
  // For now, keep as-is; in production, use a sanitizer
  return html
}

export const JournalEditor: React.FC<Props> = ({ date, entryId, onClose }) => {
  const store = useJournalStore()
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [mlProcessingStatus, setMlProcessingStatus] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const isInitialized = useRef<boolean>(false)

  // Initialize content when component mounts or entryId changes
  useEffect(() => {
    if (!editorRef.current) return
    
    console.log('📝 JournalEditor mounted/updated with entryId:', entryId)
    
    if (entryId) {
      console.log('🔄 Editing existing entry with ID:', entryId)
      setCurrentEntryId(entryId)
      // Load existing entry content
      const existingEntry = store.getEntryById(entryId)
      console.log('📖 Loading existing entry:', { 
        found: !!existingEntry, 
        content: existingEntry?.content?.substring(0, 50) + '...' 
      })
      if (existingEntry && editorRef.current) {
        editorRef.current.innerHTML = existingEntry.content
        console.log('✅ Loaded content into editor successfully')
      } else {
        console.warn('❌ Could not load entry content - entry not found or editor not ready')
      }
    } else {
      // New entry - start with empty content
      console.log('🆕 Creating new entry - clearing content')
      setCurrentEntryId(null)
      if (editorRef.current) {
        editorRef.current.innerHTML = ''
      }
    }
    
    // Focus after content is set
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
      }
    }, 100)
  }, [entryId, store]) // Run when entryId or store changes

  // Listen for ML processing events
  useEffect(() => {
    const handleMLProcessingStarted = (e: CustomEvent) => {
      const detail = e.detail || {}
      console.log(`📝 [EDITOR] ML processing started event received:`, {
        journalId: detail.journalId,
        entryId: detail.entryId,
        processingId: detail.processingId,
        timestamp: detail.timestamp,
        currentEntryId,
        editorEntryId: entryId
      })
      
      setMlProcessingStatus('🤖 AI processing started...')
      // Clear status after 5 seconds for better visibility
      setTimeout(() => {
        console.log(`📝 [EDITOR] Clearing ML processing status after timeout`)
        setMlProcessingStatus(null)
      }, 5000)
    }

    const handleMLProcessingSuccess = (e: CustomEvent) => {
      const detail = e.detail || {}
      console.log(`📝 [EDITOR] ML processing success event received:`, {
        journalId: detail.journalId,
        entryId: detail.entryId,
        message: detail.message,
        processingId: detail.processingId,
        processingTime: detail.processingTime,
        timestamp: detail.timestamp,
        currentEntryId,
        editorEntryId: entryId
      })
      
      setMlProcessingStatus('✅ AI processing completed!')
      // Clear status after 5 seconds
      setTimeout(() => {
        console.log(`📝 [EDITOR] Clearing ML processing success status after timeout`)
        setMlProcessingStatus(null)
      }, 5000)
    }

    const handleMLProcessingError = (e: CustomEvent) => {
      const detail = e.detail || {}
      console.log(`📝 [EDITOR] ML processing error event received:`, {
        journalId: detail.journalId,
        entryId: detail.entryId,
        error: detail.error,
        processingTime: detail.processingTime,
        timestamp: detail.timestamp,
        currentEntryId,
        editorEntryId: entryId
      })
      
      setMlProcessingStatus('⚠️ AI processing delayed')
      // Clear status after 5 seconds
      setTimeout(() => {
        console.log(`📝 [EDITOR] Clearing ML processing error status after timeout`)
        setMlProcessingStatus(null)
      }, 5000)
    }

    console.log(`📝 [EDITOR] Setting up ML processing event listeners for editor with entryId:`, entryId)
    
    window.addEventListener('ml-processing-started', handleMLProcessingStarted as EventListener)
    window.addEventListener('ml-processing-success', handleMLProcessingSuccess as EventListener)
    window.addEventListener('ml-processing-error', handleMLProcessingError as EventListener)
    
    return () => {
      console.log(`📝 [EDITOR] Cleaning up ML processing event listeners for editor with entryId:`, entryId)
      window.removeEventListener('ml-processing-started', handleMLProcessingStarted as EventListener)
      window.removeEventListener('ml-processing-success', handleMLProcessingSuccess as EventListener)
      window.removeEventListener('ml-processing-error', handleMLProcessingError as EventListener)
    }
  }, [entryId, currentEntryId])

  // No cleanup needed since we removed autosave

  const handleSave = async (shouldClose = false) => {
    if (!editorRef.current || isSaving) return
    const html = sanitizeHtml(editorRef.current.innerHTML)
    
    // Only save if there's actual content (not just empty tags)
    const textContent = editorRef.current.textContent?.trim() || ''
    if (textContent.length === 0) {
      console.log('📝 [EDITOR] No content to save - entry is empty')
      return
    }
    
    const saveId = Math.random().toString(36).substring(7)
    const saveStartTime = Date.now()
    
    setIsSaving(true)
    console.log(`💾 [EDITOR-${saveId}] Starting journal save:`, { 
      isEditing: !!currentEntryId, 
      entryId: currentEntryId, 
      editorEntryId: entryId,
      contentLength: textContent.length,
      contentPreview: textContent.substring(0, 50) + '...',
      shouldClose,
      timestamp: new Date().toISOString()
    })
    
    try {
      console.log(`🔄 [EDITOR-${saveId}] Calling store.saveEntry...`)
      const savedEntry = store.saveEntry(date, html, currentEntryId || undefined)
      const saveTime = Date.now() - saveStartTime
      
      console.log(`📊 [EDITOR-${saveId}] Save result:`, {
        savedEntry: savedEntry ? {
          id: savedEntry.id,
          dateIso: savedEntry.dateIso,
          hasApiId: !!savedEntry.apiId
        } : null,
        saveTime: `${saveTime}ms`,
        timestamp: new Date().toISOString()
      })
      
      // If this was a new entry, store the ID for future updates
      if (!currentEntryId && savedEntry) {
        setCurrentEntryId(savedEntry.id)
        console.log(`✅ [EDITOR-${saveId}] New entry created with ID:`, savedEntry.id)
      } else {
        console.log(`✅ [EDITOR-${saveId}] Updated existing entry with ID:`, currentEntryId)
      }
      
      setLastSaved(Date.now())
      
      // Only close if explicitly requested
      if (shouldClose) {
        console.log(`🚪 [EDITOR-${saveId}] Closing editor after save`)
        onClose()
      } else {
        console.log(`📝 [EDITOR-${saveId}] Keeping editor open after save`)
      }
    } catch (saveError) {
      const saveTime = Date.now() - saveStartTime
      console.error(`💥 [EDITOR-${saveId}] Save failed:`, {
        error: saveError instanceof Error ? saveError.message : saveError,
        stack: saveError instanceof Error ? saveError.stack : undefined,
        saveTime: `${saveTime}ms`,
        entryId: currentEntryId,
        editorEntryId: entryId,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsSaving(false)
      const totalSaveTime = Date.now() - saveStartTime
      console.log(`🏁 [EDITOR-${saveId}] Save operation completed in ${totalSaveTime}ms`)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const handleDelete = () => {
    if (currentEntryId) {
      console.log('🗑️ Deleting entry from editor:', currentEntryId)
      store.deleteEntry(currentEntryId)
      onClose()
    }
  }

  const onInput = () => {
    // Remove autosave - only save when user clicks Save button
    // This prevents saving incomplete content while typing
  }

  const onFocus = () => {
    // Don't interfere with typing
  }

  const onBlur = () => {
    // Don't interfere with typing
  }

  const applyCommand = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    // Don't autosave when applying formatting commands
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
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {isSaving ? 'Saving...' : lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Not saved yet'}
              </div>
              {mlProcessingStatus && (
                <div style={{ fontSize: 12, color: '#8B5CF6', marginTop: 4, fontWeight: 500 }}>
                  {mlProcessingStatus}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => applyCommand('bold')} style={{ padding: '8px 12px' }}>B</button>
              <button onClick={() => applyCommand('italic')} style={{ padding: '8px 12px' }}>I</button>
              <button onClick={() => applyCommand('underline')} style={{ padding: '8px 12px' }}>U</button>
              <button onClick={() => applyCommand('insertUnorderedList')} style={{ padding: '8px 12px' }}>• List</button>
              <button onClick={() => applyCommand('formatBlock', '<blockquote>')} style={{ padding: '8px 12px' }}>❝ Quote</button>
              <button 
                onClick={() => handleSave(false)} 
                disabled={isSaving}
                style={{ 
                  padding: '8px 12px', 
                  background: isSaving ? '#9ca3af' : '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 6,
                  cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => handleSave(true)} 
                disabled={isSaving}
                style={{ 
                  padding: '8px 12px', 
                  background: isSaving ? '#9ca3af' : '#8B5CF6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 6,
                  cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? 'Saving...' : 'Save & Close'}
              </button>
              {currentEntryId && (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ 
                    padding: '8px 12px', 
                    background: '#dc2626', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteConfirm(false)
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              Delete Journal Entry
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JournalEditor
