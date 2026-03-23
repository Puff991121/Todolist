from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# 显式加载当前目录下的 .env 文件
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

# 请根据您的本地 MySQL 配置修改以下 URL
# 格式: mysql+mysqlconnector://user:password@host:port/dbname
_user = os.getenv("DB_USER", "root")
_password = os.getenv("DB_PASSWORD", "Flt991121")
_host = os.getenv("DB_HOST", "localhost")
_port = os.getenv("DB_PORT", "3306")
_name = os.getenv("DB_NAME", "todolist_db")

# 获取环境变量，Vercel 等平台通常会提供 DATABASE_URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if SQLALCHEMY_DATABASE_URL:
    # 兼容 Postgres: SQLAlchemy 要求使用 postgresql:// 而非 postgres://
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # 本地开发默认使用 MySQL
    SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{_user}:{_password}@{_host}:{_port}/{_name}"

from sqlalchemy.pool import NullPool

# 根据环境判断是否使用 NullPool
# Vercel 环境下通常定义了 VERCEL 环境变量
is_vercel = os.getenv("VERCEL") == "1"

engine_args = {
    "pool_pre_ping": True
}

if is_vercel:
    # Serverless 环境下建议不使用连接池，直接使用 NullPool
    engine_args["poolclass"] = NullPool

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
