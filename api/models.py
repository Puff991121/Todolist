from sqlalchemy import Column, Integer, String, Date, Text, Enum, TIMESTAMP, func
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    task_date = Column(Date, nullable=False)
    status = Column(Enum('pending', 'completed'), default='pending')
    category_color = Column(String(20), default='#007bff')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
