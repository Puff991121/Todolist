import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Trash2 } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [categoryColor, setCategoryColor] = useState('#007bff');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setTaskDate(task.task_date);
      setStatus(task.status);
      setCategoryColor(task.category_color);
    } else {
      setTitle('');
      setDescription('');
      setTaskDate(format(selectedDate, 'yyyy-MM-dd'));
      setStatus('pending');
      setCategoryColor('#007bff');
    }
  }, [task, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      task_date: taskDate,
      status,
      category_color: categoryColor
    });
  };

  const colors = [
    { name: 'Apple Blue', value: '#007bff' },
    { name: 'Apple Green', value: '#28a745' },
    { name: 'Apple Orange', value: '#ff9500' },
    { name: 'Apple Red', value: '#ff3b30' },
    { name: 'Apple Purple', value: '#5856d6' },
    { name: 'Apple Gray', value: '#8e8e93' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2>{task ? '编辑任务' : '新建任务'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>任务标题</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="做什么？"
              required 
            />
          </div>

          <div className="form-group">
            <label>日期</label>
            <input 
              type="date" 
              value={taskDate} 
              onChange={e => setTaskDate(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="添加备注..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>分类颜色</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colors.map(color => (
                <div 
                  key={color.value}
                  onClick={() => setCategoryColor(color.value)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: color.value,
                    cursor: 'pointer',
                    border: categoryColor === color.value ? '2px solid #555' : 'none',
                    boxShadow: categoryColor === color.value ? '0 0 5px rgba(0,0,0,0.2)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>状态</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="pending">待办</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          <div className="modal-actions">
            {task && (
              <button 
                type="button" 
                className="btn-danger" 
                onClick={() => onDelete(task.id)}
                style={{ background: '#ff3b30', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={18} /> 删除
              </button>
            )}
            <button type="button" onClick={onClose} style={{ background: '#f5f5f7', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>取消</button>
            <button type="submit" className="btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
