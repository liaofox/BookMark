# 私人网址收藏夹

一个基于 Flask 的私人网址收藏管理系统，支持用户注册登录和网址收藏管理。

## 功能特性

- ✅ 用户注册和登录
- ✅ 安全的密码哈希存储
- ✅ 网址收藏管理（添加、查看、删除）
- ✅ 响应式网页设计
- ✅ 数据持久化存储（SQLite）

## 安装和运行

### 1. 安装依赖
```bash
pip install -r requirements.txt
```

### 2. 启动服务器
```bash
python run.py
```

### 3. 访问应用
打开浏览器访问：http://localhost:5000

## 使用说明

1. **注册账号**：首次使用需要注册一个新账号
2. **登录系统**：使用注册的账号密码登录
3. **添加书签**：在仪表板页面添加网址收藏
4. **管理收藏**：可以查看、访问和删除收藏的网址

## 项目结构

```
BookMarkOnline/
├── app.py              # 主应用文件
├── run.py              # 启动脚本
├── requirements.txt    # Python依赖
├── bookmarks.db        # 数据库文件（自动创建）
└── templates/          # 网页模板
    ├── base.html       # 基础模板
    ├── login.html      # 登录页面
    ├── register.html   # 注册页面
    └── dashboard.html  # 主界面
```

## 技术栈

- **后端**: Python Flask, SQLAlchemy, Werkzeug
- **前端**: Bootstrap 5, JavaScript
- **数据库**: SQLite
- **安全**: 密码哈希加密

## 注意事项

- 默认运行在 5000 端口
- 调试模式已开启，生产环境请设置 `debug=False`
- 数据存储在本地 SQLite 数据库
- 建议定期备份 `bookmarks.db` 文件