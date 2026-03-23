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
  isAfter,
  isBefore,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ currentMonth, tasks, onPrev, onNext, onToday, onDayClick, onTaskClick }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDay = (date) => {
    return tasks.filter(task => isSameDay(parseISO(task.task_date), date));
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="current-month">
          {format(currentMonth, 'MMMM yyyy')}
          <span className="task-count-badge">{tasks.length} 任务</span>
        </div>
        <div className="calendar-controls">
          <button className="btn-secondary" onClick={onToday} style={{ border: '1px solid #d2d2d7', background: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Today</button>
          <button className="btn-icon" onClick={onPrev} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={20} /></button>
          <button className="btn-icon" onClick={onNext} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
        
        {calendarDays.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={idx} 
              className={`calendar-day ${!isCurrentMonth ? 'not-current-month' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className="day-number">{format(day, 'd')}</div>
              <div className="tasks-container">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="task-item-mini"
                    style={{ 
                      backgroundColor: task.category_color,
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.7 : 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                  >
                    {task.title}
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
