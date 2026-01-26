Write-Host "私人网址收藏夹环境设置脚本" -ForegroundColor Green
Write-Host "=========================================="

# 检查 Python
Write-Host "`n检查 Python 安装..." -ForegroundColor Yellow
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "✓ 已找到 Python: $($python.Source)" -ForegroundColor Green
    Write-Host "Python 版本:" -NoNewline
    & python --version
} else {
    Write-Host "✗ 未找到 Python" -ForegroundColor Red
    Write-Host "请从 https://www.python.org/downloads/ 下载安装 Python"
    Write-Host "安装时请勾选 'Add Python to PATH' 选项"
}

# 检查 pip
Write-Host "`n检查 pip 安装..." -ForegroundColor Yellow
$pip = Get-Command pip -ErrorAction SilentlyContinue
if ($pip) {
    Write-Host "✓ 已找到 pip: $($pip.Source)" -ForegroundColor Green
} else {
    Write-Host "✗ 未找到 pip" -ForegroundColor Red
}

Write-Host "`n安装说明:" -ForegroundColor Cyan
Write-Host "1. 如果已安装 Python 和 pip，运行: pip install -r requirements.txt"
Write-Host "2. 然后运行: python run.py"
Write-Host "3. 打开浏览器访问: http://localhost:5000"

Write-Host "`n按任意键继续..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")