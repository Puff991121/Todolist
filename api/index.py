from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import os
import traceback

import crud, models, schemas
from database import engine, get_db

# 自动创建表（如果不存在）
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database creation failed: {e}")

app = FastAPI(title="Todo List API")

# 全局异常处理器，用于捕捉 Vercel 上的 500 错误并暴露细节
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_details = traceback.format_exc()
    print(f"Unhandled Exception: {error_details}")
    return JSONResponse(
        status_code=500,
        content={
            "code": "500",
            "message": "Internal Server Error",
            "detail": str(exc),
            "traceback": error_details if os.getenv("VERCEL") != "1" else "See logs for details"
        }
    )

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@app.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tasks(db, skip=skip, limit=limit)

@app.get("/tasks/range/", response_model=List[schemas.Task])
def read_tasks_by_range(start: date, end: date, db: Session = Depends(get_db)):
    return crud.get_tasks_by_date_range(db, start_date=start, end_date=end)

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id=task_id, task=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    success = crud.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
