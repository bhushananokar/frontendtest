import { useState } from 'react';
import { DEFAULT_TASKS } from '../lib/constants';

export interface Task {
  text: string;
  completed: boolean;
}

export const useAppState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 365 days');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showEmotionFilter, setShowEmotionFilter] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('Date');
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState('Emotion');
  
  const [tasks, setTasks] = useState<Task[]>([...DEFAULT_TASKS]);

  const toggleTask = (index: number) => {
    setTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    currentPage,
    setCurrentPage,
    showAccountDropdown,
    setShowAccountDropdown,
    selectedTimeRange,
    setSelectedTimeRange,
    showTimeRangeDropdown,
    setShowTimeRangeDropdown,
    showDateFilter,
    setShowDateFilter,
    showEmotionFilter,
    setShowEmotionFilter,
    selectedDateFilter,
    setSelectedDateFilter,
    selectedEmotionFilter,
    setSelectedEmotionFilter,
    tasks,
    setTasks,
    toggleTask
  };
};
