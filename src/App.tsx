import { useState } from 'react'
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Flower2, 
  Settings, 
  Plus,
  HelpCircle,
  Menu,
  Search,
  ChevronDown,
  User,
  Calendar,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Therapy } from './components/Therapy'
import { Journaling } from './components/Journaling'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 365 days')
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false)
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [showEmotionFilter, setShowEmotionFilter] = useState(false)
  const [selectedDateFilter, setSelectedDateFilter] = useState('Date')
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState('Emotion')
  const [tasks, setTasks] = useState([
    { text: 'Create a user flow of social application design', completed: true },
    { text: 'Create a user flow of social application design', completed: true },
    { text: 'Landing page design for Fintech project', completed: true },
    { text: 'Interactive prototype for app screens', completed: false },
    { text: 'Interactive prototype for app screens', completed: true }
  ])
  const [currentMonth, setCurrentMonth] = useState(7) // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [selectedDate, setSelectedDate] = useState(24)

  const timeRangeOptions = ['7 days', '30 days', '60 days', '180 days', 'Last 365 days']
  const dateFilterOptions = ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom Range']
  const emotionFilterOptions = ['Happy', 'Anxious', 'Angry', 'Thrilling', 'Calm', 'Excited']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const toggleTask = (index: number) => {
    setTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ))
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
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

  const sidebarStyle = {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    height: '100vh',
    width: sidebarOpen ? '250px' : '60px',
    background: 'linear-gradient(180deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
    transition: 'width 0.3s ease',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    color: 'white'
  }

  const mainStyle = {
    marginLeft: sidebarOpen ? '250px' : '60px',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    width: `calc(100vw - ${sidebarOpen ? '250px' : '60px'})`
  }

  const headerStyle = {
    height: '64px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: '8px'
  }

  const menuButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    color: '#6b7280'
  }

  const sidebarHeaderStyle = {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }

  const logoStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const createButtonStyle = {
    width: sidebarOpen ? '100%' : '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: sidebarOpen ? 'flex-start' : 'center',
    gap: '8px',
    padding: sidebarOpen ? '0 16px' : '0',
    cursor: 'pointer',
    margin: '16px',
    transition: 'all 0.3s ease'
  }

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    margin: '4px 16px',
    transition: 'background-color 0.2s ease'
  }

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  }

  const helpButtonStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    margin: '16px'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Header */}
        <div style={sidebarHeaderStyle}>
          <div style={logoStyle}>
            <Brain size={20} color="#8B5CF6" />
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: '18px', fontWeight: '600' }}>MindSpace</span>
          )}
        </div>

        {/* Create Note Button */}
        <button style={createButtonStyle}>
          <Plus size={16} />
          {sidebarOpen && <span style={{ marginLeft: '8px' }}>Create Note</span>}
        </button>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '8px 0' }}>
          <div 
            style={currentPage === 'dashboard' ? activeNavItemStyle : navItemStyle}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </div>
          <div 
            style={currentPage === 'journaling' ? activeNavItemStyle : navItemStyle}
            onClick={() => setCurrentPage('journaling')}
          >
            <BookOpen size={20} />
            {sidebarOpen && <span>Journaling</span>}
          </div>
          <div 
            style={currentPage === 'therapy' ? activeNavItemStyle : navItemStyle}
            onClick={() => setCurrentPage('therapy')}
          >
            <Brain size={20} />
            {sidebarOpen && <span>Therapy</span>}
          </div>
          <div 
            style={currentPage === 'meditation' ? activeNavItemStyle : navItemStyle}
            onClick={() => setCurrentPage('meditation')}
          >
            <Flower2 size={20} />
            {sidebarOpen && <span>Meditation</span>}
          </div>
          <div 
            style={currentPage === 'settings' ? activeNavItemStyle : navItemStyle}
            onClick={() => setCurrentPage('settings')}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Menu settings</span>}
          </div>
        </div>

        {/* Help Button */}
        <button style={helpButtonStyle}>
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <button 
            style={menuButtonStyle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Welcome to MindSpace
          </span>
        </header>

        {/* Main Content */}
        <main style={{ padding: currentPage === 'therapy' || currentPage === 'journaling' ? '0' : '32px' }}>
          {currentPage === 'therapy' ? (
            <Therapy />
          ) : currentPage === 'journaling' ? (
            <Journaling />
          ) : (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Dashboard Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '32px' 
            }}>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#111827', 
                margin: 0 
              }}>
                {currentPage === 'dashboard' ? 'Dashboard' : 
                 currentPage === 'therapy' ? 'Therapy' :
                 currentPage === 'journaling' ? 'Journaling' :
                 currentPage === 'meditation' ? 'Meditation' :
                 currentPage === 'settings' ? 'Settings' : 'Dashboard'}
              </h1>
            
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Search Box */}
                <div style={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Search 
                    size={20} 
                    style={{ 
                      position: 'absolute', 
                      left: '16px', 
                      color: '#9ca3af' 
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    style={{
                      width: '320px',
                      height: '44px',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '22px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>

                {/* Account Popper */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#8B5CF6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '22px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <User size={16} />
                    <span>Shitty Mindcare</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showAccountDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      padding: '8px',
                      minWidth: '180px',
                      zIndex: 1000
                    }}>
                      <div style={{ padding: '8px 12px', fontSize: '14px', color: '#6b7280' }}>Account</div>
                      <div style={{ padding: '8px 12px', fontSize: '14px', cursor: 'pointer', borderRadius: '6px' }}>Profile</div>
                      <div style={{ padding: '8px 12px', fontSize: '14px', cursor: 'pointer', borderRadius: '6px' }}>Settings</div>
                      <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }}></div>
                      <div style={{ padding: '8px 12px', fontSize: '14px', cursor: 'pointer', borderRadius: '6px', color: '#ef4444' }}>Logout</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '24px' 
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#111827', 
                margin: 0 
              }}>
                Overview
              </h2>
              
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span>{selectedTimeRange}</span>
                  <ChevronDown size={16} />
                </button>
                
                {showTimeRangeDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    padding: '8px',
                    minWidth: '160px',
                    zIndex: 1000
                  }}>
                    {timeRangeOptions.map((option) => (
                      <div 
                        key={option}
                        onClick={() => {
                          setSelectedTimeRange(option)
                          setShowTimeRangeDropdown(false)
                        }}
                        style={{ 
                          padding: '8px 12px', 
                          fontSize: '14px', 
                          cursor: 'pointer', 
                          borderRadius: '6px',
                          color: selectedTimeRange === option ? '#8B5CF6' : '#374151',
                          backgroundColor: selectedTimeRange === option ? '#f3e8ff' : 'transparent'
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* Journaling Card */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <BookOpen size={24} color="#8B5CF6" />
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Journaling</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>26/30 Days</div>
                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} />
                  <span>12% increase from last month</span>
                </div>
              </div>

              {/* Meditation Streak Card */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#fef3e2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Flower2 size={24} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Meditation Streak</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>123 Days</div>
                <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Last Streak - 234</span>
                </div>
              </div>

              {/* Next Therapy Session Card */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e0f2fe',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Calendar size={24} color="#0ea5e9" />
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Next Therapy Session</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>28 Aug</div>
                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} />
                  <span>8% increase from last month</span>
                </div>
              </div>

              {/* Mindful Time Card */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#fef7cd',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Clock size={24} color="#eab308" />
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Mindful Time This Week</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>74 Minutes</div>
                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} />
                  <span>7% increase from last week</span>
                </div>
              </div>
            </div>

            {/* Bottom Section - 4 Components */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Journaling Summary */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px' 
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Journaling summary
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#8B5CF6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {selectedDateFilter} <ChevronDown size={12} />
                      </button>
                      
                      {showDateFilter && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: '8px',
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          padding: '8px',
                          minWidth: '140px',
                          zIndex: 1000
                        }}>
                          {dateFilterOptions.map((option) => (
                            <div 
                              key={option}
                              onClick={() => {
                                setSelectedDateFilter(option)
                                setShowDateFilter(false)
                              }}
                              style={{ 
                                padding: '8px 12px', 
                                fontSize: '12px', 
                                cursor: 'pointer', 
                                borderRadius: '6px',
                                color: selectedDateFilter === option ? '#8B5CF6' : '#374151',
                                backgroundColor: selectedDateFilter === option ? '#f3e8ff' : 'transparent'
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => setShowEmotionFilter(!showEmotionFilter)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#8B5CF6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {selectedEmotionFilter} <ChevronDown size={12} />
                      </button>
                      
                      {showEmotionFilter && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: '8px',
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          padding: '8px',
                          minWidth: '120px',
                          zIndex: 1000
                        }}>
                          {emotionFilterOptions.map((option) => (
                            <div 
                              key={option}
                              onClick={() => {
                                setSelectedEmotionFilter(option)
                                setShowEmotionFilter(false)
                              }}
                              style={{ 
                                padding: '8px 12px', 
                                fontSize: '12px', 
                                cursor: 'pointer', 
                                borderRadius: '6px',
                                color: selectedEmotionFilter === option ? '#8B5CF6' : '#374151',
                                backgroundColor: selectedEmotionFilter === option ? '#f3e8ff' : 'transparent'
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table Header */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', 
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  <div>Name</div>
                  <div>Summary</div>
                  <div>Date</div>
                  <div>Emotion</div>
                  <div>Progress</div>
                </div>

                {/* Table Rows */}
                {[
                  { name: 'Spent time with Bhushan', summary: 'Meeting Friends', date: 'Aug 23, 2025', emotion: 'Happy', progress: 100, color: '#10b981' },
                  { name: 'Physics exam went good', summary: 'Exams', date: 'Aug 22, 2025', emotion: 'Anxious', progress: 70, color: '#f59e0b' },
                  { name: 'Media channel branding', summary: 'Meeting', date: 'Aug 21, 2025', emotion: 'Angry', progress: 60, color: '#ef4444' },
                  { name: 'Date with Ameya', summary: 'Coffee Date', date: 'Aug 20, 2025', emotion: 'Happy', progress: 100, color: '#10b981' },
                  { name: 'Sports with Friends', summary: 'Played Hockey', date: 'Aug 19, 2025', emotion: 'Thrilling', progress: 80, color: '#8B5CF6' }
                ].map((entry, index) => (
                  <div key={index} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', 
                    gap: '12px',
                    padding: '12px 0',
                    fontSize: '12px',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: '#111827', fontWeight: '500' }}>{entry.name}</div>
                    <div style={{ color: '#6b7280' }}>{entry.summary}</div>
                    <div style={{ color: '#6b7280' }}>{entry.date}</div>
                    <div>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: entry.emotion === 'Happy' ? '#dcfce7' : 
                                       entry.emotion === 'Anxious' ? '#fef3c7' :
                                       entry.emotion === 'Angry' ? '#fee2e2' : '#f3e8ff',
                        color: entry.color,
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {entry.emotion}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: entry.color
                      }}>
                        {entry.progress}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Progress */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px' 
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Overall Progress
                  </h3>
                  <button style={{
                    padding: '6px 12px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    All <ChevronDown size={12} />
                  </button>
                </div>

                {/* Progress Circle */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{ 
                    position: 'relative',
                    width: '120px',
                    height: '120px',
                    marginBottom: '16px'
                  }}>
                    <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={`${72 * 3.14159} ${(100 - 72) * 3.14159}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>72%</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Completed</div>
                    </div>
                  </div>
                  <MoreHorizontal size={20} color="#6b7280" />
                </div>

                {/* Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '16px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>95</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Sessions</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>26</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Completed</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>35</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Incomplete</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B5CF6' }}>35</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Skipped</div>
                  </div>
                </div>
              </div>

              {/* Today's Task */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
                  Today's task
                </h3>

                {/* Task List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.map((task, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '8px 0'
                    }}>
                      <div 
                        onClick={() => toggleTask(index)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: task.completed ? '#8B5CF6' : 'transparent',
                          border: task.completed ? 'none' : '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {task.completed && <Check size={12} color="white" />}
                      </div>
                      <span 
                        onClick={() => toggleTask(index)}
                        style={{ 
                          fontSize: '14px', 
                          color: task.completed ? '#6b7280' : '#111827',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                border: '1px solid #f3f4f6', 
                padding: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px' 
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => navigateMonth('prev')}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronLeft size={16} color="#6b7280" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronRight size={16} color="#6b7280" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {/* Days of week */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280' 
                    }}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar dates */}
                  {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => i + 1).map(date => (
                    <div 
                      key={date} 
                      onClick={() => setSelectedDate(date)}
                      style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        fontSize: '14px',
                        color: date === selectedDate ? 'white' : '#111827',
                        backgroundColor: date === selectedDate ? '#8B5CF6' : 'transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: date === selectedDate ? '600' : 'normal',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (date !== selectedDate) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (date !== selectedDate) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
