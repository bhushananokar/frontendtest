import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { EmotionRadarData } from '../../data/mockChartData';

interface EmotionRadarChartProps {
  data: EmotionRadarData[];
  height?: number;
}

export const EmotionRadarChart: React.FC<EmotionRadarChartProps> = ({ 
  data, 
  height = 300 
}) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            gridType="polygon" 
            strokeWidth={1}
            stroke="#e5e7eb"
          />
          <PolarAngleAxis 
            dataKey="emotion" 
            fontSize={12}
            fontWeight="500"
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            fontSize={10}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Emotion Level"
            dataKey="intensity"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.25}
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Emotion Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">{item.emotion}</span>
            <span className="text-purple-600 font-bold">{item.intensity}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionRadarChart;