import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TaskCompletionData } from '../../data/mockChartData';

interface TaskCompletionChartProps {
  data: TaskCompletionData[];
  height?: number;
  completionRate?: number;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
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
      fontSize={13} 
      fontWeight="bold"
    >
      {`${value}%`}
    </text>
  );
};

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ 
  data, 
  height = 200, 
  completionRate = 75 
}) => {

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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="75%" // Moved the chart center down to create more space above
              innerRadius={65} 
              outerRadius={95} 
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
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{completionRate}%</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>Overall Completion</div>
      </div>

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