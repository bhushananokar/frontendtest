// src/components/TaskItem.tsx
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Task } from '../hooks/useAppState';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px', // Reduced gap
        padding: '12px 16px', // Reduced padding for a smaller height
        backgroundColor: task.completed ? '#f0fdf4' : 'white',
        borderRadius: '10px', // Slightly smaller border radius
        border: `1px solid ${task.completed ? '#bbf7d0' : '#e5e7eb'}`,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isHovering ? 'translateY(-2px)' : 'translateY(0)', // Reduced hover lift
        boxShadow: isHovering ? '0 3px 6px rgba(0, 0, 0, 0.06)' : '0 1px 3px rgba(0, 0, 0, 0.04)' // Reduced shadow
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onToggle}
    >
      <button
        style={{
          width: '20px', // Reduced button size
          height: '20px', // Reduced button size
          borderRadius: '4px', // Reduced border radius
          border: task.completed ? 'none' : '2px solid #d1d5db',
          backgroundColor: task.completed ? '#10b981' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {task.completed && <Check size={12} color="white" />} {/* Reduced icon size */}
      </button>
      <span
        style={{
          fontSize: '14px', // Reduced font size
          color: task.completed ? '#16a34a' : '#111827',
          textDecoration: task.completed ? 'line-through' : 'none',
          fontWeight: task.completed ? '400' : '500'
        }}
      >
        {task.text}
      </span>
    </div>
  );
};

export default TaskItem;