import React from 'react';
import { 
  format, 
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ currentMonth, tasks, onPrev, onNext, onToday, onDayClick, onTaskClick }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getTasksForDay = (day) => {
    return tasks.filter(task => isSameDay(parseISO(task.task_date), day));
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="current-month">
          {format(currentMonth, 'yyyy年MM月')}
          <span className="task-count-badge">
            本月共有 {tasks.filter(t => isSameMonth(parseISO(t.task_date), currentMonth)).length} 个活跃任务
          </span>
        </div>
        <div className="calendar-controls">
          <div style={{ display: 'flex', background: '#f0f0f2', borderRadius: '8px', padding: '4px' }}>
            <button className="control-btn" style={{ background: 'transparent' }} onClick={onPrev}><ChevronLeft size={16} /></button>
            <button className="control-btn" style={{ background: 'white', fontWeight: 'bold' }} onClick={onToday}>今天</button>
            <button className="control-btn" style={{ background: 'transparent' }} onClick={onNext}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
        {days.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={idx} 
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className="day-number">{format(day, 'd')}</div>
              <div className="task-list-mini">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="task-item-mini"
                    style={{ 
                      backgroundColor: task.category_color || '#007aff',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.6 : 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                  >
                    {task.title.length > 6 ? `${task.title.slice(0, 6)}...` : task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
