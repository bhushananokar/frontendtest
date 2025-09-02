import React from 'react';
import { 
  BookOpen,
  Flower2,
  Search,
  ChevronDown,
  User,
  Calendar,
  Clock,
  TrendingUp,
  Check
} from "lucide-react";
import { 
  TIME_RANGE_OPTIONS
} from '../lib/constants';
import { 
  dashboardContainerStyle, 
  dashboardHeaderStyle, 
  overviewSectionStyle,
  dashboardCardsStyle,
  bottomSectionStyle 
} from '../lib/styles';
import { Task } from '../hooks/useAppState';

interface DashboardProps {
  showAccountDropdown: boolean;
  setShowAccountDropdown: (show: boolean) => void;
  selectedTimeRange: string;
  setSelectedTimeRange: (range: string) => void;
  showTimeRangeDropdown: boolean;
  setShowTimeRangeDropdown: (show: boolean) => void;
  tasks: Task[];
  toggleTask: (index: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  showAccountDropdown,
  setShowAccountDropdown,
  selectedTimeRange,
  setSelectedTimeRange,
  showTimeRangeDropdown,
  setShowTimeRangeDropdown,
  tasks,
  toggleTask
}) => {
  return (
    <div style={{ padding: '32px' }}>
      <div style={dashboardContainerStyle}>
        {/* Dashboard Header */}
        <div style={dashboardHeaderStyle}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#111827', 
            margin: 0 
          }}>
            Dashboard
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
                  {/* Account dropdown content */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div style={overviewSectionStyle}>
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
                {TIME_RANGE_OPTIONS.map((option) => (
                  <div 
                    key={option}
                    onClick={() => {
                      setSelectedTimeRange(option);
                      setShowTimeRangeDropdown(false);
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
        <div style={dashboardCardsStyle}>
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

        {/* Bottom Section - Tasks and Summary */}
        <div style={bottomSectionStyle}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0'
                }}>
                  <button
                    onClick={() => toggleTask(index)}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: task.completed ? 'none' : '2px solid #d1d5db',
                      backgroundColor: task.completed ? '#10b981' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {task.completed && <Check size={10} color="white" />}
                  </button>
                  <span style={{ 
                    fontSize: '14px', 
                    color: task.completed ? '#6b7280' : '#111827',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder for other components */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
            border: '1px solid #f3f4f6', 
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
              Overall Progress
            </h3>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              Coming Soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
