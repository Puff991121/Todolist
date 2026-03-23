from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    task_date: date
    status: str = "pending"
    category_color: str = "#007bff"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_date: Optional[date] = None
    status: Optional[str] = None
    category_color: Optional[str] = None

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
