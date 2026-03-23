# Todo List 应用运行指南

这是一个使用 React + Python (FastAPI) + MySQL 构建的高级任务管理应用。

## 技术栈
- **前端**: React 18, Vite, Vanilla CSS, Lucide React (图标), date-fns (日期处理)
- **后端**: Python 3.8+, FastAPI, SQLAlchemy, Uvicorn
- **数据库**: MySQL

## 环境准备
1. **MySQL**: 确保本地运行着 MySQL 服务。
2. **Python**: 推荐使用 Python 3.10+。
3. **Node.js**: 运行前端开发服务器。

## 启动步骤

### 1. 数据库初始化 (Windows PowerShell 兼容)
在 PowerShell 中使用以下命令：
```powershell
Get-Content f:\ChengPin\定做的模板\AI\Todolist\backend\init_db.sql | mysql -u root -p
```
或者先进入 mysql 命令行，然后执行：
```sql
source f:\ChengPin\定做的模板\AI\Todolist\backend\init_db.sql;
```

### 2. 后端启动
进入 `backend` 目录，安装依赖并运行：
```bash
cd backend
pip install -r requirements.txt
# 修改 database.py 中的数据库连接字符串（如果需要）
python main.py
```
后端默认运行在 `http://localhost:8000`。

### 3. 前端启动
进入 `frontend` 目录，安装依赖并运行：
```bash
cd frontend
npm install
npm run dev
```
前端开发服务器将运行在 `http://localhost:3000`，并已配置代理转发 API 请求到后端。

## 主要功能
- **日历视图**: 直观查看每个月的任务分布。
- **任务管理**: 点击日期或“新建任务”按钮即可添加、编辑、删除任务。
- **分类标签**: 支持通过颜色对任务进行分类。
- **状态追踪**: 任务支持“未完成”和“已完成”状态，并实时同步到数据库。
