#!/usr/bin/env python3
"""
启动脚本 - 私人网址收藏夹
"""
from app import app, db

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("正在启动私人网址收藏夹服务器...")
    print("访问地址: http://localhost:5000")
    print("按 Ctrl+C 停止服务器")
    app.run(debug=True, host='0.0.0.0', port=5000)