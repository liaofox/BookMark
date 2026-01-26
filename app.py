from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookmarks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    bookmarks = db.relationship('Bookmark', backref='user', lazy=True)

class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if User.query.filter_by(username=username).first():
            return jsonify({'error': '用户名已存在'}), 400
            
        user = User(
            username=username,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': '注册成功'}), 201
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            return jsonify({'message': '登录成功'}), 200
        else:
            return jsonify({'error': '用户名或密码错误'}), 401
    
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/api/bookmarks', methods=['GET', 'POST'])
def bookmarks():
    if 'user_id' not in session:
        return jsonify({'error': '请先登录'}), 401
    
    if request.method == 'GET':
        bookmarks = Bookmark.query.filter_by(user_id=session['user_id']).all()
        return jsonify([{
            'id': b.id,
            'title': b.title,
            'url': b.url,
            'description': b.description,
            'created_at': b.created_at.isoformat()
        } for b in bookmarks])
    
    elif request.method == 'POST':
        data = request.get_json()
        bookmark = Bookmark(
            title=data['title'],
            url=data['url'],
            description=data.get('description', ''),
            user_id=session['user_id']
        )
        db.session.add(bookmark)
        db.session.commit()
        return jsonify({'message': '书签添加成功'}), 201

@app.route('/api/bookmarks/<int:bookmark_id>', methods=['PUT', 'DELETE'])
def bookmark_detail(bookmark_id):
    if 'user_id' not in session:
        return jsonify({'error': '请先登录'}), 401
    
    bookmark = Bookmark.query.get_or_404(bookmark_id)
    if bookmark.user_id != session['user_id']:
        return jsonify({'error': '无权操作'}), 403
    
    if request.method == 'PUT':
        data = request.get_json()
        bookmark.title = data['title']
        bookmark.url = data['url']
        bookmark.description = data.get('description', '')
        db.session.commit()
        return jsonify({'message': '书签更新成功'})
    
    elif request.method == 'DELETE':
        db.session.delete(bookmark)
        db.session.commit()
        return jsonify({'message': '书签删除成功'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)