import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Flower2, 
  Settings, 
  Plus,
  HelpCircle
} from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
  currentPage: string
  onPageChange: (page: string) => void
}

export const Sidebar = ({ sidebarOpen, currentPage, onPageChange }: SidebarProps) => {
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
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          return (
            <div 
              key={item.id}
              style={currentPage === item.id ? activeNavItemStyle : navItemStyle}
              onClick={() => onPageChange(item.id)}
            >
              <IconComponent size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          )
        })}
      </div>

      {/* Help Button */}
      <button style={helpButtonStyle}>
        <HelpCircle size={20} />
      </button>
    </div>
  )
}
