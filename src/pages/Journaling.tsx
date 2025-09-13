import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, ArrowLeft } from 'lucide-react'
import useJournalStore from '@/hooks/useJournalStore'

export const Journaling = () => {
  const [currentMonth, setCurrentMonth] = useState(7) // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Force re-render when entries change

  const store = useJournalStore()

  // Listen for journal saves to refresh calendar
  useEffect(() => {
    const handleJournalSaved = () => {
      setRefreshKey(prev => prev + 1)
    }

    window.addEventListener('journal-saved', handleJournalSaved)
    window.addEventListener('journal-deleted', handleJournalSaved)
    
    return () => {
      window.removeEventListener('journal-saved', handleJournalSaved)
      window.removeEventListener('journal-deleted', handleJournalSaved)
    }
  }, [])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  // Get real journal entries from store
  const getJournalEntriesForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const entry = store.getEntry(date)
    if (!entry || !entry.content) return []
    
    // Convert stored content to display format - refreshKey forces re-render
    return [{
      title: 'Journal Entry',
      time: new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'Personal',
      content: entry.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
      color: '#8B5CF6',
      _refreshKey: refreshKey // Use refreshKey to force component updates
    }]
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(prev => prev - 1)
      } else {
        setCurrentMonth(prev => prev - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(prev => prev + 1)
      } else {
        setCurrentMonth(prev => prev + 1)
      }
    }
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    setIsDrawerOpen(true)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    if (!selectedDay) return
    
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    let newDay = selectedDay
    
    if (direction === 'prev') {
      newDay = selectedDay > 1 ? selectedDay - 1 : daysInMonth
      if (selectedDay === 1) {
        navigateMonth('prev')
      }
    } else {
      newDay = selectedDay < daysInMonth ? selectedDay + 1 : 1
      if (selectedDay === daysInMonth) {
        navigateMonth('next')
      }
    }
    
    setSelectedDay(newDay)
  }

  const getSelectedDateString = () => {
    if (!selectedDay) return ''
    const date = new Date(currentYear, currentMonth, selectedDay)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{ height: '120px' }}></div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const entries = getJournalEntriesForDay(day)
      const hasEntries = entries.length > 0

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          style={{
            height: '120px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            backgroundColor: hasEntries ? 'white' : '#fdfcf8',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.15)'
            e.currentTarget.style.borderColor = '#8B5CF6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          {/* Day number */}
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: hasEntries ? '#111827' : '#9ca3af',
            marginBottom: '4px'
          }}>
            {day}
          </div>

          {/* Journal entries */}
          {entries.slice(0, 3).map((entry: ReturnType<typeof getJournalEntriesForDay>[0], index: number) => (
            <div
              key={index}
              style={{
                fontSize: '10px',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                padding: '2px 6px',
                borderRadius: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              • {typeof entry === 'string' ? entry : entry.title}
            </div>
          ))}

          {/* Show more indicator */}
          {entries.length > 3 && (
            <div style={{
              fontSize: '9px',
              color: '#8B5CF6',
              fontWeight: '500',
              marginTop: 'auto'
            }}>
              +{entries.length - 3} more
            </div>
          )}

          {/* Entry count indicator */}
          {hasEntries && (
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '16px',
              height: '16px',
              backgroundColor: '#8B5CF6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'white',
              fontWeight: '600'
            }}>
              {entries.length}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <div style={{ 
      backgroundColor: '#fdfcf8', 
      minHeight: 'calc(100vh - 64px)',
      padding: '0'
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 32px 24px 100px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          {/* Add New Journal For Today Button */}
          <button
            onClick={() => {
              try {
                const dateIso = new Date().toISOString().split('T')[0]
                window.dispatchEvent(new CustomEvent('open-journal-editor', { detail: { dateIso } }))
              } catch {
                // Fallback - no action needed
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7C3AED'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8B5CF6'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)'
            }}
          >
            <Plus size={16} />
            Add New Journal For Today
          </button>
        </div>

        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => navigateMonth('prev')}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#8B5CF6'
              e.currentTarget.style.color = '#8B5CF6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => navigateMonth('next')}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#8B5CF6'
              e.currentTarget.style.color = '#8B5CF6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ padding: '32px 32px 32px 100px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            backgroundColor: '#fdfcf8',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {dayNames.map((day) => (
              <div
                key={day}
                style={{
                  padding: '16px 8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  letterSpacing: '0.5px'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#e5e7eb',
            padding: '1px'
          }}>
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* Journal Drawer */}
      {isDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDrawerOpen(false)
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              maxHeight: '85vh',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              margin: '20px',
              transform: 'scale(1)',
              opacity: 1,
              transition: 'all 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ 
              borderBottom: '1px solid #f3f4f6',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#8B5CF6',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#7C3AED'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#8B5CF6'
                    }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {getSelectedDateString()}
                  </h2>
                </div>

                {/* Previous/Next Day Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => navigateDay('prev')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#6b7280',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8B5CF6'
                      e.currentTarget.style.color = '#8B5CF6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button
                    onClick={() => navigateDay('next')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#6b7280',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8B5CF6'
                      e.currentTarget.style.color = '#8B5CF6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Journal Entries */}
            <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto', flex: 1 }}>
              {selectedDay && getJournalEntriesForDay(selectedDay).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {getJournalEntriesForDay(selectedDay).map((entry: ReturnType<typeof getJournalEntriesForDay>[0], index: number) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#fdfcf8',
                        border: '1px solid #f3f4f6',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        // Open editor for this date
                        const date = new Date(currentYear, currentMonth, selectedDay)
                        const dateIso = date.toISOString().split('T')[0]
                        window.dispatchEvent(new CustomEvent('open-journal-editor', { detail: { dateIso } }))
                        setIsDrawerOpen(false)
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.1)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fdfcf8'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                            {entry.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                padding: '4px 12px',
                                backgroundColor: '#f3e8ff',
                                color: entry.color,
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {entry.emotion}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                              <Clock size={14} />
                              <span style={{ fontSize: '12px' }}>{entry.time}</span>
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#6b7280' 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    No journal entries yet
                  </h3>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    Start writing your thoughts for {getSelectedDateString()}
                  </p>
                  <button
                    onClick={() => {
                      const date = new Date(currentYear, currentMonth, selectedDay!)
                      const dateIso = date.toISOString().split('T')[0]
                      window.dispatchEvent(new CustomEvent('open-journal-editor', { detail: { dateIso } }))
                      setIsDrawerOpen(false)
                    }}
                    style={{
                      marginTop: '16px',
                      padding: '8px 16px',
                      backgroundColor: '#8B5CF6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Add Journal Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
