import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TaskCompletionData } from '../../data/mockChartData';

interface TaskCompletionChartProps {
  data: TaskCompletionData[];
  height?: number;
  completionRate?: number; // Overall completion rate for needle
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ 
  data, 
  height = 300,
  completionRate = 75 // Default to 75% completion
}) => {
  const [animatedRate, setAnimatedRate] = useState(0);

  useEffect(() => {
    // Animate the needle to its final position
    const timer = setTimeout(() => {
      setAnimatedRate(completionRate);
    }, 300);

    return () => clearTimeout(timer);
  }, [completionRate]);

  // Calculate needle angle (0% = 180°, 100% = 0°)
  const needleAngle = 180 - (180 * animatedRate / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ 
        width: '100%', 
        height: height, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="60%"
              innerRadius={50}
              outerRadius={90}
              fill="#8884d8"
              stroke="none"
              labelLine={false}
              label={renderCustomizedLabel}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Needle Overlay */}
        {/* Pin/needle overlay removed as requested */}
      </div>
      
      {/* Completion Rate Display */}
      <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{completionRate}%</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>Overall Completion</div>
      </div>

      {/* Color Legend - Only show color representations */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '14px' }}>
        {data.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '2px',
                backgroundColor: entry.color 
              }}
            ></div>
            <span style={{ color: '#374151', fontWeight: '500' }}>{entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCompletionChart;