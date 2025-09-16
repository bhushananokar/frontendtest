import { useCallback } from 'react'
import { journalApi } from '@/lib/journalApi'

export type JournalEntry = {
  id: string // Unique identifier for each entry
  dateIso: string
  content: string
  updatedAt: number
  apiId?: string // Store the API ID for future updates
}

const STORAGE_KEY = 'mindspace_journals_v1'

function isoDateKey(date: Date) {
  // Use local date to avoid timezone issues
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper function to format date consistently across the app
export function formatDateToISO(date: Date): string {
  return isoDateKey(date)
}

// Helper function to convert Firebase Timestamp to JavaScript Date
function convertFirebaseTimestamp(timestamp: any): Date | null {
  try {
    // Handle Firebase Timestamp format: {_seconds: number, _nanoseconds: number}
    if (timestamp && typeof timestamp === 'object' && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000)
    }
    
    // Handle regular date string or number
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      const date = new Date(timestamp)
      return isNaN(date.getTime()) ? null : date
    }
    
    return null
  } catch (error) {
    console.warn('Error converting timestamp:', error, timestamp)
    return null
  }
}

function readAll(): Record<string, JournalEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to read journal storage', e)
    return {}
  }
}

function writeAll(data: Record<string, JournalEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to write journal storage', e)
  }
}

function generateEntryId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useJournalStore = () => {
  const getEntry = useCallback((date: Date): JournalEntry | null => {
    const key = isoDateKey(date)
    const all = readAll()
    return all[key] ?? null
  }, [])

  const getEntriesForDate = useCallback((date: Date): JournalEntry[] => {
    const key = isoDateKey(date)
    const all = readAll()
    return Object.values(all).filter(entry => entry.dateIso === key)
  }, [])

  const getEntryById = useCallback((entryId: string) => {
    const all = readAll()
    const entry = all[entryId] || null
    console.log('🔍 getEntryById called:', { entryId, found: !!entry, totalEntries: Object.keys(all).length })
    return entry
  }, [])

  const saveEntry = useCallback((date: Date, content: string, entryId?: string) => {
    const key = isoDateKey(date)
    const all = readAll()
    
    // Generate new ID if not provided (for new entries)
    const id = entryId || generateEntryId()
    const existingEntry = all[id]
    
    console.log('saveEntry called with:', { entryId, id, hasExistingEntry: !!existingEntry, existingApiId: existingEntry?.apiId })
    
    // Create/update local entry
    const entry: JournalEntry = { 
      id,
      dateIso: key, 
      content, 
      updatedAt: Date.now(),
      apiId: existingEntry?.apiId // Preserve existing API ID if any
    }
    all[id] = entry
    writeAll(all)
    
    // Sync with API in the background (don't block the UI)
    syncWithApi(date, content, id, existingEntry?.apiId)
    
    // Notify listeners
    try {
      window.dispatchEvent(new CustomEvent('journal-saved', { detail: { dateIso: key, entryId: id } }))
    } catch {
      // ignore
    }
    return entry
  }, [])

  // Helper function to sync with API
  const syncWithApi = async (date: Date, content: string, entryId: string, existingApiId?: string) => {
    try {
      let apiId: string | undefined
      
      if (existingApiId) {
        // Update existing entry
        const result = await journalApi.updateJournal(existingApiId, {
          content,
          title: `Journal Entry - ${date.toLocaleDateString()}`
        })
        
        if (result.success) {
          console.log('Journal entry updated in API successfully')
          apiId = existingApiId
        } else {
          console.warn('Failed to update journal entry in API:', result.error)
        }
      } else {
        // Create new entry
        const result = await journalApi.createJournalFromDate(date, content)
        
        if (result.success && result.data) {
          console.log('Journal entry created in API successfully with ID:', result.data.id)
          apiId = result.data.id
          
          // Update local storage with API ID for future updates
          const all = readAll()
          if (all[entryId]) {
            all[entryId].apiId = result.data.id
            writeAll(all)
            console.log('Updated local entry with API ID:', result.data.id)
          }
        } else {
          console.warn('Failed to create journal entry in API:', result.error)
        }
      }

      // Trigger ML processing if we have a valid API ID
      if (apiId) {
        const mlProcessingId = Math.random().toString(36).substring(7)
        const mlStartTime = Date.now()
        
        try {
          console.log(`🤖 [ML-STORE-${mlProcessingId}] Starting ML processing workflow:`, {
            journalId: apiId,
            entryId,
            userId: 'digitaltwin-user',
            triggerImmediate: false,
            timestamp: new Date().toISOString(),
            context: existingApiId ? 'update' : 'create'
          })
          
          // Dispatch ML processing started event
          try {
            window.dispatchEvent(new CustomEvent('ml-processing-started', { 
              detail: { 
                journalId: apiId, 
                entryId,
                processingId: mlProcessingId,
                timestamp: new Date().toISOString()
              } 
            }))
            console.log(`📢 [ML-STORE-${mlProcessingId}] Dispatched ml-processing-started event`)
          } catch (eventError) {
            console.warn(`⚠️ [ML-STORE-${mlProcessingId}] Failed to dispatch ml-processing-started event:`, eventError)
          }
          
          console.log(`🔄 [ML-STORE-${mlProcessingId}] Calling journalApi.triggerMLProcessing...`)
          const mlResult = await journalApi.triggerMLProcessing(apiId, 'digitaltwin-user', false)
          const mlProcessingTime = Date.now() - mlStartTime
          
          console.log(`📊 [ML-STORE-${mlProcessingId}] ML processing result:`, {
            success: mlResult.success,
            data: mlResult.data,
            error: mlResult.error,
            processingTime: `${mlProcessingTime}ms`,
            timestamp: new Date().toISOString()
          })
          
          if (mlResult.success) {
            console.log(`✅ [ML-STORE-${mlProcessingId}] ML processing completed successfully:`, {
              message: mlResult.data?.message,
              processingId: mlResult.data?.processingId,
              processingTime: `${mlProcessingTime}ms`
            })
            
            // Dispatch ML processing success event
            try {
              window.dispatchEvent(new CustomEvent('ml-processing-success', { 
                detail: { 
                  journalId: apiId, 
                  entryId, 
                  message: mlResult.data?.message,
                  processingId: mlResult.data?.processingId,
                  processingTime: mlProcessingTime,
                  timestamp: new Date().toISOString()
                } 
              }))
              console.log(`📢 [ML-STORE-${mlProcessingId}] Dispatched ml-processing-success event`)
            } catch (eventError) {
              console.warn(`⚠️ [ML-STORE-${mlProcessingId}] Failed to dispatch ml-processing-success event:`, eventError)
            }
          } else {
            console.warn(`⚠️ [ML-STORE-${mlProcessingId}] ML processing failed:`, {
              error: mlResult.error,
              processingTime: `${mlProcessingTime}ms`,
              journalId: apiId,
              entryId
            })
            
            // Dispatch ML processing error event
            try {
              window.dispatchEvent(new CustomEvent('ml-processing-error', { 
                detail: { 
                  journalId: apiId, 
                  entryId, 
                  error: mlResult.error,
                  processingTime: mlProcessingTime,
                  timestamp: new Date().toISOString()
                } 
              }))
              console.log(`📢 [ML-STORE-${mlProcessingId}] Dispatched ml-processing-error event`)
            } catch (eventError) {
              console.warn(`⚠️ [ML-STORE-${mlProcessingId}] Failed to dispatch ml-processing-error event:`, eventError)
            }
          }
        } catch (mlError) {
          const mlProcessingTime = Date.now() - mlStartTime
          console.error(`💥 [ML-STORE-${mlProcessingId}] ML processing workflow failed with exception:`, {
            error: mlError instanceof Error ? mlError.message : mlError,
            stack: mlError instanceof Error ? mlError.stack : undefined,
            processingTime: `${mlProcessingTime}ms`,
            journalId: apiId,
            entryId,
            timestamp: new Date().toISOString()
          })
          
          // Dispatch ML processing error event
          try {
            window.dispatchEvent(new CustomEvent('ml-processing-error', { 
              detail: { 
                journalId: apiId, 
                entryId, 
                error: mlError instanceof Error ? mlError.message : 'Unknown error',
                processingTime: mlProcessingTime,
                timestamp: new Date().toISOString()
              } 
            }))
            console.log(`📢 [ML-STORE-${mlProcessingId}] Dispatched ml-processing-error event for exception`)
          } catch (eventError) {
            console.warn(`⚠️ [ML-STORE-${mlProcessingId}] Failed to dispatch ml-processing-error event for exception:`, eventError)
          }
          
          // Don't throw - ML processing failure shouldn't affect journal saving
        }
      } else {
        console.log(`ℹ️ [ML-STORE] Skipping ML processing - no valid API ID available:`, {
          apiId,
          entryId,
          hasExistingApiId: !!existingApiId,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error syncing with API:', error)
      // Don't throw - we want local storage to work even if API fails
    }
  }

  const deleteEntry = useCallback((entryId: string) => {
    const all = readAll()
    const existingEntry = all[entryId]
    
    if (existingEntry) {
      // Delete from local storage
      delete all[entryId]
      writeAll(all)
      
      // Delete from API in the background if it exists
      if (existingEntry.apiId) {
        deleteFromApi(existingEntry.apiId)
      }
      
      try {
        window.dispatchEvent(new CustomEvent('journal-deleted', { detail: { dateIso: existingEntry.dateIso, entryId } }))
      } catch {
        // ignore
      }
    }
  }, [])

  // Helper function to delete from API
  const deleteFromApi = async (apiId: string) => {
    try {
      const result = await journalApi.deleteJournal(apiId)
      if (result.success) {
        console.log('Journal entry deleted from API successfully')
      } else {
        console.warn('Failed to delete journal entry from API:', result.error)
      }
    } catch (error) {
      console.error('Error deleting from API:', error)
    }
  }

  const listEntries = useCallback((): JournalEntry[] => {
    const all = readAll()
    return Object.values(all)
  }, [])

  // Function to sync existing entries from API (replaces local storage with database entries)
  const syncExistingEntries = useCallback(async () => {
    try {
      console.log('Starting sync from cloud...')
      const result = await journalApi.getUserJournals()
      if (result.success && result.data) {
        console.log(`Found ${result.data.length} entries in API`)
        
        // Clear local storage and start fresh with database entries
        const all: Record<string, JournalEntry> = {}
        let syncedCount = 0
        
        result.data.forEach(apiEntry => {
          if (apiEntry.createdAt) {
            try {
              // Convert Firebase Timestamp to JavaScript Date
              const date = convertFirebaseTimestamp(apiEntry.createdAt)
              
              if (date) {
                const key = isoDateKey(date)
                const entryId = `api_${apiEntry.id}` // Use API ID as local ID
                
                // Convert updatedAt timestamp as well
                const updatedAt = convertFirebaseTimestamp(apiEntry.updatedAt || apiEntry.createdAt)
                
                all[entryId] = {
                  id: entryId,
                  dateIso: key,
                  content: apiEntry.content,
                  updatedAt: updatedAt ? updatedAt.getTime() : Date.now(),
                  apiId: apiEntry.id
                }
                syncedCount++
                console.log('Synced entry from API:', { id: apiEntry.id, date: key, content: apiEntry.content.substring(0, 50) + '...' })
              } else {
                console.warn('Could not convert timestamp in API entry:', apiEntry.createdAt)
              }
            } catch (error) {
              console.warn('Error processing API entry:', error, apiEntry)
            }
          }
        })
        
        // Replace local storage with database entries
        writeAll(all)
        console.log(`Successfully synced ${syncedCount} entries from API (replaced local storage)`)
        
        // Notify listeners that entries have been updated
        try {
          window.dispatchEvent(new CustomEvent('journal-synced'))
        } catch {
          // ignore
        }
      } else {
        console.warn('Failed to fetch entries from API:', result.error)
      }
    } catch (error) {
      console.error('Error syncing existing entries:', error)
    }
  }, [])

  // Function to clear all local storage (useful for testing)
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Local storage cleared')
      
      // Notify listeners
      try {
        window.dispatchEvent(new CustomEvent('journal-synced'))
      } catch {
        // ignore
      }
    } catch (error) {
      console.error('Error clearing local storage:', error)
    }
  }, [])

  return { getEntry, getEntriesForDate, getEntryById, saveEntry, deleteEntry, listEntries, syncExistingEntries, clearLocalStorage }
}

export default useJournalStore
