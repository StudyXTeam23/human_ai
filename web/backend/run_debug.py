"""
调试启动脚本 - 在 IDE 中运行这个文件来启动后端服务器

使用方法:
1. 在 IDE 中打开这个文件
2. 右键 -> Run 'run_debug' 或 Debug 'run_debug'
3. 访问 http://localhost:8000
"""
import sys
import os
from pathlib import Path

# 设置正确的工作目录和 Python 路径
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))
os.chdir(backend_dir)

# 设置代理环境变量(如果需要访问 OpenAI API)
os.environ["HTTP_PROXY"] = "http://127.0.0.1:7890"
os.environ["HTTPS_PROXY"] = "http://127.0.0.1:7890"

print("=" * 70)
print("🚀 启动 FastAPI 调试服务器")
print("=" * 70)
print(f"📍 工作目录: {backend_dir}")
print(f"📍 Python 路径: {sys.executable}")
print(f"📍 Python 版本: {sys.version.split()[0]}")
print(f"🌐 代理设置: {os.environ.get('HTTPS_PROXY')}")
print(f"🔗 访问地址: http://localhost:18201")
print(f"📚 API 文档: http://localhost:18201/docs")
print("=" * 70)
print()

# 导入并启动应用
try:
    import uvicorn
    from app.main import app
    
    print("✅ 模块导入成功")
    print("✅ 正在启动服务器...\n")
    
    # 启动服务器
    uvicorn.run(
        app,  # 直接传入 app 对象,而不是字符串
        host="0.0.0.0",
        port=18201,
        reload=False,  # 调试模式下禁用 reload
        log_level="info"
    )
    
except ImportError as e:
    print(f"\n❌ 导入错误: {e}")
    print("\n可能的原因:")
    print("1. 虚拟环境未激活")
    print("2. 依赖未安装")
    print("\n解决方法:")
    print("方法1: 在 IDE 中设置 Python 解释器为:")
    print(f"       {backend_dir}/venv/bin/python")
    print("\n方法2: 在终端中运行:")
    print(f"       cd {backend_dir}")
    print("       source venv/bin/activate")
    print("       pip install -r requirements.txt")
    print("       python run_debug.py")
    sys.exit(1)
    
except Exception as e:
    print(f"\n❌ 启动失败: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

