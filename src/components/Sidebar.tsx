import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Flower2, 
  Settings, 
  HelpCircle,
  Menu
} from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
  currentPage: string
  onPageChange: (page: string) => void
  onToggleSidebar: () => void
}

export const Sidebar = ({ sidebarOpen, currentPage, onPageChange, onToggleSidebar }: SidebarProps) => {
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

  const sidebarHeaderStyle = {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: sidebarOpen ? 'space-between' : 'center'
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

  const menuButtonStyle = {
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
    transition: 'all 0.2s ease'
  }

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: sidebarOpen ? '12px' : '0px',
    padding: sidebarOpen ? '12px 16px' : '12px',
    cursor: 'pointer',
    borderRadius: '8px',
    margin: sidebarOpen ? '4px 16px' : '4px 8px',
    transition: 'all 0.2s ease',
    justifyContent: sidebarOpen ? 'flex-start' : 'center'
  }

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  }

  const helpButtonStyle = {
    width: '44px',
    height: '44px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    margin: sidebarOpen ? '16px' : '16px 8px',
    transition: 'all 0.3s ease'
  }

  const navigationItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'journaling', icon: BookOpen, label: 'Journaling' },
    { id: 'therapy', icon: Brain, label: 'Therapy' },
    { id: 'meditation', icon: Flower2, label: 'Meditation' },
    { id: 'settings', icon: Settings, label: 'Menu settings' }
  ]

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={sidebarHeaderStyle}>
        {sidebarOpen ? (
          <>
            <div style={logoStyle}>
              <Brain size={20} color="#8B5CF6" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>MindSpace</span>
            <button 
              style={menuButtonStyle}
              onClick={onToggleSidebar}
            >
              <Menu size={18} />
            </button>
          </>
        ) : (
          <button 
            style={menuButtonStyle}
            onClick={onToggleSidebar}
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: '8px 0' }}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = currentPage === item.id
          
          return (
            <div 
              key={item.id}
              style={isActive ? activeNavItemStyle : navItemStyle}
              onClick={() => onPageChange(item.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
              title={!sidebarOpen ? item.label : ''}
            >
              <IconComponent size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          )
        })}
      </div>

      {/* Help Button */}
      <button 
        style={helpButtonStyle}
        title={!sidebarOpen ? 'Help' : ''}
      >
        <HelpCircle size={20} />
      </button>
    </div>
  )
}
