# 🚀 部署指南

## GitHub 仓库设置

### 1. 创建新的 GitHub 仓库
1. 访问 [github.com/new](https://github.com/new)
2. 输入仓库名称（例如：`bookmark-online`）
3. 选择公开（Public）或私有（Private）
4. 不要初始化 README（因为我们已经有了）
5. 点击 "Create repository"

### 2. 上传代码到 GitHub
```bash
# 初始化本地 Git 仓库
git init
git add .
git commit -m "初始化私人网址收藏夹项目"

# 连接到 GitHub 仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

## 🌐 部署到云端平台

### 选项1: Heroku 部署（推荐免费方案）

#### 创建 Heroku 应用
1. 注册 Heroku 账号：https://heroku.com
2. 安装 Heroku CLI：https://devcenter.heroku.com/articles/heroku-cli

#### 准备部署文件
创建 `Procfile`：
```
web: gunicorn app:app
```

创建 `runtime.txt`：
```
python-3.9.13
```

#### 部署命令
```bash
# 登录 Heroku
heroku login

# 创建应用
heroku create your-app-name

# 部署
git push heroku main

# 查看日志
heroku logs --tail
```

### 选项2: PythonAnywhere 部署

1. 注册 PythonAnywhere：https://www.pythonanywhere.com
2. 上传代码文件
3. 设置虚拟环境并安装依赖
4. 配置 Web App 指向 `app.py`
5. 重新加载应用

### 选项3: Railway 部署

1. 注册 Railway：https://railway.app
2. 连接 GitHub 仓库
3. 自动检测 Python 项目
4. 设置启动命令：`python run.py`
5. 自动部署

## 🔧 环境变量配置（可选）

对于生产环境，建议设置：

```bash
# 生成安全的密钥
python -c "import os; print(os.urandom(24).hex())"

# 设置环境变量
export FLASK_ENV=production
export SECRET_KEY=你的密钥
```

## 📊 数据库管理

应用使用 SQLite 数据库，文件为 `bookmarks.db`。在生产环境中，建议：

1. 定期备份数据库文件
2. 考虑使用 PostgreSQL（Heroku 提供）
3. 设置自动备份机制

## 🔍 故障排除

### 常见问题

1. **端口占用**：修改 `run.py` 中的端口号
2. **依赖问题**：确保所有依赖正确安装
3. **数据库权限**：确保应用有写入权限

### 日志查看
```bash
# Heroku
heroku logs --tail

# 本地
python run.py
```

## 🌍 域名绑定（可选）

如果你有自己的域名：
1. 在域名注册商处设置 CNAME 记录
2. 在部署平台配置自定义域名
3. 设置 SSL 证书

---

**提示**：建议先在本地测试完成后再部署到云端平台。