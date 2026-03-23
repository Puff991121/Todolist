import mysql.connector
from mysql.connector import errorcode
import os
from dotenv import load_dotenv

# 显式加载当前目录下的 .env 文件
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

# 请填写您的 MySQL 配置
# 从环境变量中读取配置，默认为 root/password
DB_CONFIG = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'Flt991121'),
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'port': os.getenv('DB_PORT', '3306'),
}

def setup_database():
    try:
        # 1. 连接到 MySQL 服务器
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # 2. 读取 SQL 文件内容
        sql_path = os.path.join(os.path.dirname(__file__), 'init_db.sql')
        with open(sql_path, 'r', encoding='utf-8') as f:
            sql_commands = f.read().split(';')
            
        # 3. 逐条执行 SQL 命令
        print("正在初始化数据库...")
        for command in sql_commands:
            if command.strip():
                try:
                    cursor.execute(command)
                except mysql.connector.Error as err:
                    if err.errno == errorcode.ER_DB_CREATE_EXISTS:
                        print("数据库已存在，跳过创建。")
                    else:
                        print(f"执行出错: {err}")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("数据库初始化完成！")
        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("用户名或密码错误")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("数据库不存在")
        else:
            print(err)

if __name__ == "__main__":
    setup_database()
