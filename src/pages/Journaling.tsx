import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, ArrowLeft } from 'lucide-react'

export const Journaling = () => {
  const [currentMonth, setCurrentMonth] = useState(7) // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  // Sample journal data with detailed entries for each day
  const journalEntries = {
    1: [
      { title: 'I Had a Great Day', time: '9:30 AM', emotion: 'Happy', content: 'Today was incredibly productive... Feeling really positive about tomorrow', color: '#10b981' },
      { title: 'Morning Thoughts', time: '7:15 AM', emotion: 'Calm', content: 'Woke idea feeling refreshed. Had strange drook. Decided to start fri book.', color: '#0ea5e9' },
      { title: 'Evening Reflection', time: '8:45 PM', emotion: 'Grateful', content: 'Grateful for all the opportunities today brought', color: '#8B5CF6' }
    ],
    16: [
      { title: 'INening Day', time: '2:15 PM', emotion: 'Anxious', content: 'Spent hoursut grapping with... Spent timuns lero incolusive... Need consult Dr. Chen', color: '#f59e0b' },
      { title: 'The Science Dilemma', time: '6:30 PM', emotion: 'Frustrated', content: 'The experiment results were inconclusive Dinner', color: '#ef4444' },
      { title: 'Morning Thoughts', time: '8:00 AM', emotion: 'Hopeful', content: 'Woke idea feeling refreshed. Had strange drook. Decided to start fri book.', color: '#8B5CF6' }
    ],
    24: [
      { title: 'Weekend Plans', time: '11:30 AM', emotion: 'Excited', content: 'Planning something amazing for the weekend with friends', color: '#10b981' },
      { title: 'Work Reflection', time: '4:45 PM', emotion: 'Productive', content: 'Got a lot done today, feeling accomplished', color: '#0ea5e9' }
    ]
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
      const entries = journalEntries[day as keyof typeof journalEntries] || []
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
            backgroundColor: hasEntries ? 'white' : '#f9fafb',
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
          {entries.slice(0, 3).map((entry, index) => (
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
      backgroundColor: '#f8f9fa', 
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
              const today = new Date().getDate()
              handleDayClick(today)
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
            backgroundColor: '#f8f9fa',
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
              {selectedDay && journalEntries[selectedDay as keyof typeof journalEntries] ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(journalEntries[selectedDay as keyof typeof journalEntries] as any[]).map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #f3f4f6',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.1)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {typeof entry === 'string' ? (
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
                            {entry}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Click to read more...
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                              {entry.title}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  padding: '4px 12px',
                                  backgroundColor: entry.emotion === 'Happy' ? '#dcfce7' : 
                                                 entry.emotion === 'Anxious' ? '#fef3c7' :
                                                 entry.emotion === 'Frustrated' ? '#fee2e2' :
                                                 entry.emotion === 'Excited' ? '#dbeafe' :
                                                 entry.emotion === 'Calm' ? '#e0f2fe' :
                                                 entry.emotion === 'Grateful' ? '#f3e8ff' :
                                                 entry.emotion === 'Hopeful' ? '#f3e8ff' :
                                                 entry.emotion === 'Productive' ? '#e0f2fe' : '#f3f4f6',
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
                      )}
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
