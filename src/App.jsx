import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { Search, Bell, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Calendar from './components/Calendar';
import TaskModal from './components/TaskModal';

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchTasks = async () => {
    try {
      const start = format(startOfWeek(startOfMonth(currentMonth)), 'yyyy-MM-dd');
      const end = format(endOfWeek(endOfMonth(currentMonth)), 'yyyy-MM-dd');
      const response = await axios.get(`/api/tasks/range/?start=${start}&end=${end}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleOpenModal = (date = new Date(), task = null) => {
    setSelectedDate(date);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await axios.put(`/api/tasks/${selectedTask.id}`, taskData);
      } else {
        await axios.post('/api/tasks/', taskData);
      }
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      if (error.response && error.response.data) {
        console.error("Backend Error Detail:", error.response.data);
        alert(`保存失败: ${error.response.data.message || '未知错误'}\n${error.response.data.detail || ''}`);
      } else {
        alert("保存失败，请检查网络连接或服务器状态");
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Puff's Todolist</div>
        <div className="search-bar">
          <Search size={18} color="#86868b" />
          <input type="text" placeholder="搜索任务..." />
        </div>
        <div className="nav-actions">
          <Bell size={20} color="#86868b" />
          <Settings size={20} color="#86868b" />
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> <span>新建任务</span>
          </button>
        </div>
      </header>

      <main>
        <Calendar 
          currentMonth={currentMonth}
          tasks={tasks}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          onToday={handleToday}
          onDayClick={(date) => handleOpenModal(date)}
          onTaskClick={(task) => handleOpenModal(parseISO(task.task_date), task)}
        />
      </main>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
         <button className="btn-primary" style={{ padding: '12px 40px', borderRadius: '30px', background: 'transparent', border: '1px dashed #ccc', color: '#666' }} onClick={() => handleOpenModal()}>
            <Plus size={18} /> <span>安排新任务</span>
         </button>
      </div>

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          selectedDate={selectedDate}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default App;
