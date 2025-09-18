import React from 'react';
import ActivityCalendar from 'react-activity-calendar';
import { ActivityData } from '../../data/mockChartData';

interface WeeklyActivityHeatmapProps {
  data: ActivityData[];
}

export const WeeklyActivityHeatmap: React.FC<WeeklyActivityHeatmapProps> = ({ 
  data
}) => {
  // Transform data to the format expected by react-activity-calendar
  const transformedData = data.map(item => ({
    date: item.day,
    count: Math.round(item.value / 10), // Convert 0-100 scale to 0-10 levels
    level: Math.min(4, Math.floor(item.value / 20)) // Convert to 0-4 levels for coloring
  }));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <ActivityCalendar
        data={transformedData}
        theme={{
          light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
        }}
        blockSize={12}
        blockMargin={3}
        fontSize={12}
        hideColorLegend={false}
        hideMonthLabels={false}
        hideTotalCount={false}
        showWeekdayLabels={true}
        style={{
          color: '#374151'
        }}
        labels={{
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          totalCount: '{{count}} activities this year',
          legend: {
            less: 'Less',
            more: 'More'
          }
        }}
      />
    </div>
  );
};

export default WeeklyActivityHeatmap;