import { useCallback } from 'react'

export type JournalEntry = {
  dateIso: string
  content: string
  updatedAt: number
}

const STORAGE_KEY = 'mindspace_journals_v1'

function isoDateKey(date: Date) {
  return date.toISOString().split('T')[0]
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

export const useJournalStore = () => {
  const getEntry = useCallback((date: Date): JournalEntry | null => {
    const key = isoDateKey(date)
    const all = readAll()
    return all[key] ?? null
  }, [])

  const saveEntry = useCallback((date: Date, content: string) => {
    const key = isoDateKey(date)
    const all = readAll()
    const entry: JournalEntry = { dateIso: key, content, updatedAt: Date.now() }
    all[key] = entry
    writeAll(all)
    // Notify listeners
    try {
      window.dispatchEvent(new CustomEvent('journal-saved', { detail: { dateIso: key } }))
    } catch {
      // ignore
    }
    return entry
  }, [])

  const deleteEntry = useCallback((date: Date) => {
    const key = isoDateKey(date)
    const all = readAll()
    delete all[key]
    writeAll(all)
    try {
      window.dispatchEvent(new CustomEvent('journal-deleted', { detail: { dateIso: key } }))
    } catch {
      // ignore
    }
  }, [])

  const listEntries = useCallback((): JournalEntry[] => {
    const all = readAll()
    return Object.values(all)
  }, [])

  return { getEntry, saveEntry, deleteEntry, listEntries }
}

export default useJournalStore
