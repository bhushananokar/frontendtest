import React from 'react';
import { 
  Search,
  ChevronDown,
  User
} from "lucide-react";
import { 
  TIME_RANGE_OPTIONS
} from '../lib/constants';
import { 
  dashboardContainerStyle, 
  dashboardHeaderStyle, 
  overviewSectionStyle
} from '../lib/styles';
import { Task } from '../hooks/useAppState';
import TaskCompletionChart from '../components/charts/TaskCompletionChart';
import YouTubeVideoCards from '@/components/YoutubeVideoCards';
import EmotionRadarChart from '../components/charts/EmotionRadarChart';
import { chartData } from '../data/mockChartData';
import TaskItem from '@/components/TaskItem';

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
  const taskCompletionData = chartData.taskCompletion.map(item => ({ ...item }));
  const emotionData = chartData.emotionDistribution.map(item => ({ ...item }));

  const handleHorizontalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

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
        
        {/* TOP ROW - Task Completion & YouTube Videos */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Task Completion Chart (Left) */}
          <div style={{ 
            flex: '1',
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
            border: '1px solid #f3f4f6', 
            padding: '12px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827', 
              margin: '0 0 12px 0' 
            }}>
              Task Completion
            </h3>
            <TaskCompletionChart data={taskCompletionData} height={160} completionRate={75} />
          </div>

          {/* YouTube Videos Cards (Right) */}
          <div 
            style={{ 
              flex: '2',
              backgroundColor: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
              border: '1px solid #f3f4f6', 
              padding: '12px',
              minWidth: '0'
            }}
            onWheel={handleHorizontalScroll}
          >
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827', 
              margin: '0 0 12px 0' 
            }}>
              Recommended Videos
            </h3>
            <YouTubeVideoCards />
          </div>
        </div>
        
        {/* MIDDLE SECTION - Emotional Radar Chart and Today's Tasks */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Emotional Radar Chart (Left) */}
          <div style={{
            flex: '1',
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
            border: '1px solid #f3f4f6', 
            padding: '24px',
            minWidth: '0'
          }}>
            <EmotionRadarChart data={emotionData} height={300} />
          </div>

          {/* Today's Tasks - Vertical List (Right) */}
          <div style={{
            flex: '1',
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
            border: '1px solid #f3f4f6', 
            padding: '24px',
            minWidth: '0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
              Today's Tasks
            </h3>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {tasks.map((task, index) => (
                <TaskItem 
                  key={index}
                  task={task}
                  onToggle={() => toggleTask(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};