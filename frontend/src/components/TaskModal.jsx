import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Trash2 } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007aff');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setColor(task.category_color || '#007aff');
      setStatus(task.status || 'pending');
    } else {
      setTitle('');
      setDescription('');
      setColor('#007aff');
      setStatus('pending');
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      task_date: format(selectedDate, 'yyyy-MM-dd'),
      category_color: color,
      status
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2>{task ? '编辑任务' : '新建任务'} - {format(selectedDate, 'MM月dd日')}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>任务标题</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="做什么？" 
              required
            />
          </div>

          <div className="form-group">
            <label>备注描述</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="添加一些细节..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>颜色分类</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['#007aff', '#34c759', '#ff3b30', '#ff9500', '#5856d6'].map(c => (
                <div 
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    backgroundColor: c, 
                    cursor: 'pointer',
                    border: color === c ? '3px solid #333' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {task && (
            <div className="form-group">
              <label>状态</label>
              <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">未完成</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          )}

          <div className="btn-group">
            {task && (
              <button 
                type="button" 
                className="btn-primary" 
                style={{ background: '#ff3b30' }}
                onClick={() => onDelete(task.id)}
              >
                <Trash2 size={18} /> 删除
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-primary" style={{ background: '#eee', color: '#333' }}>取消</button>
            <button type="submit" className="btn-primary">保存任务</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
