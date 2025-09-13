import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Flower2, 
  Settings, 
  HelpCircle,
  Menu,
  Pencil
} from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
  currentPage: string
  onPageChange: (page: string) => void
  onToggleSidebar: () => void
}

export const Sidebar = ({ sidebarOpen, currentPage, onPageChange, onToggleSidebar }: SidebarProps) => {
  // Coordinated animation system - faster and more responsive
  const textVisible = sidebarOpen;
  const textDelay = sidebarOpen ? '100ms' : '0ms';
  
  const textStyle = {
    opacity: textVisible ? 1 : 0,
    transition: `opacity 100ms ease ${textDelay}`,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const
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

  const sidebarHeaderStyle = {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: sidebarOpen ? 'space-between' : 'center'
  }

  const logoStyle = {
    width: '44px',
    height: '44px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    border: '2px solid rgba(255,255,255,0.7)'
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
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
    minWidth: '40px',
    minHeight: '40px'
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
    display: 'flex',
    alignItems: 'center',
    gap: sidebarOpen ? '12px' : '0px',
    padding: sidebarOpen ? '12px 16px' : '12px',
    cursor: 'pointer',
    borderRadius: '8px',
    margin: sidebarOpen ? '4px 16px' : '4px 8px',
    transition: 'all 0.2s ease',
    justifyContent: sidebarOpen ? 'flex-start' : 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white'
  }

  const navigationItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'journaling', icon: BookOpen, label: 'Journaling' },
    { id: 'therapy', icon: Brain, label: 'Therapy' },
    { id: 'meditation', icon: Flower2, label: 'Meditation' }
  ]

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings' }
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
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              flex: 1,
              ...textStyle
            }}>MindSpace</span>
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

      {/* Main Navigation */}
      <div style={{ padding: '8px 0' }}>
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
              {sidebarOpen && <span style={textStyle}>{item.label}</span>}
            </div>
          )
        })}
      </div>

      {/* Journal Now button placed below Meditation */}
      <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 16px' : '8px' }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <style>{`@keyframes ringPulse{0%{transform:scale(1);opacity:0.9}50%{transform:scale(1.45);opacity:0.28}100%{transform:scale(1);opacity:0.9}}`}</style>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: sidebarOpen ? 28 : '50%',
              top: '50%',
              transform: sidebarOpen ? 'translateY(-50%)' : 'translate(-50%,-50%)',
              width: sidebarOpen ? 72 : 88,
              height: sidebarOpen ? 72 : 88,
              borderRadius: '999px',
              background: 'rgba(6,182,212,0.08)',
              boxShadow: '0 6px 24px rgba(6,182,212,0.14)',
              animation: 'ringPulse 2000ms infinite ease-in-out'
            }}
          />

          <button
            aria-label="Journal Now"
            title={!sidebarOpen ? 'Journal Now' : ''}
            onClick={() => {
              try {
                const dateIso = new Date().toISOString().split('T')[0]
                window.dispatchEvent(new CustomEvent('open-journal-editor', { detail: { dateIso } }))
              } catch {
                // Fallback - no action needed
              }
            }}
            style={{
              width: sidebarOpen ? '220px' : '56px',
              height: '56px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '12px',
              padding: sidebarOpen ? '0 16px' : 0,
              background: 'linear-gradient(90deg, rgba(139,92,246,1) 0%, rgba(124,58,237,1) 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(99,102,241,0.18)',
              transition: 'all 200ms ease',
              fontWeight: 700,
              fontSize: '14px',
              position: 'relative',
              zIndex: 2,
              paddingLeft: sidebarOpen ? 52 : 0
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.setProperty('transform', 'translateY(-3px)')
              el.style.setProperty('box-shadow', '0 12px 32px rgba(99,102,241,0.22)')
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.setProperty('transform', 'translateY(0)')
              el.style.setProperty('box-shadow', '0 8px 24px rgba(99,102,241,0.18)')
            }}
            onFocus={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.setProperty('outline', '4px solid rgba(139,92,246,0.18)')
            }}
            onBlur={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.setProperty('outline', 'none')
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.12)'
            }}>
              <Pencil size={18} />
            </div>
            {sidebarOpen && <span style={{ lineHeight: 1 }}>{'Journal Now'}</span>}
          </button>
        </div>
      </div>

      {/* Spacer - pushes bottom items to the bottom */}
      <div style={{ flex: 1 }}></div>

      {/* Bottom Section - Settings and Help */}
      <div style={{ padding: '8px 0' }}>
        {bottomItems.map((item) => {
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
              {sidebarOpen && <span style={textStyle}>{item.label}</span>}
            </div>
          )
        })}
        
        {/* Help Button */}
        <div
          style={helpButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
          }}
          title={!sidebarOpen ? 'Help' : ''}
        >
          <HelpCircle size={20} />
          {sidebarOpen && <span style={textStyle}>Help</span>}
        </div>
      </div>
    </div>
  )
}
