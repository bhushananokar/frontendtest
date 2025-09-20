import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { EmotionRadarData } from '../../data/mockChartData';

interface EmotionRadarChartProps {
  data: EmotionRadarData[];
  height?: number;
}

export const EmotionRadarChart: React.FC<EmotionRadarChartProps> = ({ 
  data, 
  height = 220 // Reduced default height for a more compact look
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px',
        width: '100%',
        textAlign: 'center'
      }}>
        Emotional Distribution
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center', // Vertically center the chart and legend
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Chart Container with fixed height to ensure rendering */}
        <div style={{
          flex: '1 1 250px',
          height: `${height}px`, // Use the new height
          minWidth: '200px'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid 
                gridType="polygon" 
                strokeWidth={1}
                stroke="#e5e7eb"
              />
              <PolarAngleAxis 
                dataKey="emotion" 
                fontSize={11}
                fontWeight="500"
                tick={{ fill: '#374151', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                fontSize={9}
                tick={{ fill: '#6b7280', fontSize: 9 }}
                tickCount={5}
              />
              <Radar
                name="Emotion Level"
                dataKey="intensity"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 4 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Emotion Legend */}
        <div style={{
          flex: '0 1 150px',
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Overall Mood
          </h3>
          {data.map((item, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
              }}
            >
              <span style={{ 
                fontWeight: '500', 
                color: '#4b5563', 
                fontSize: '12px'
              }}>
                {item.emotion}
              </span>
              <span style={{ 
                color: '#8b5cf6', 
                fontWeight: 'bold', 
                fontSize: '12px'
              }}>
                {item.intensity}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionRadarChart;