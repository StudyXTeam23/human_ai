"""Test both text mode and file base64 mode."""
import asyncio
import httpx
from pathlib import Path


async def test_text_mode():
    """Test with text (text mode)."""
    print("=" * 70)
    print("测试 1: 文本模式 (text 不为空)")
    print("=" * 70)
    
    # Create a test file
    test_file = Path("test_text_mode.txt")
    test_content = "人工智能正在改变世界。这是一个测试文本,用于验证文本模式是否正常工作。"
    test_file.write_text(test_content, encoding="utf-8")
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            # 1. Upload file
            print("\n📤 上传文件...")
            with open(test_file, "rb") as f:
                files = {"file": (test_file.name, f, "text/plain")}
                response = await client.post(
                    "http://localhost:8000/api/v1/upload",
                    files=files
                )
                response.raise_for_status()
                upload_result = response.json()
            
            print(f"✅ 上传成功: {upload_result['file_path']}")
            print(f"   提取的文本: {upload_result['text'][:50]}...")
            
            # 2. Call humanize-file with text (text mode)
            print("\n🤖 调用 humanize-file (文本模式)...")
            payload = {
                "file_path": upload_result['file_path'],
                "text": upload_result['text'],  # 传递文本
                "params": {
                    "length": "Normal",
                    "similarity": "Moderate",
                    "style": "Friendly"
                }
            }
            
            response = await client.post(
                "http://localhost:8000/api/v1/humanize-file",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ 成功!")
                print(f"   处理时间: {result['processingTime']}ms")
                print(f"   输出: {result['content'][:100]}...")
            else:
                print(f"❌ 失败: {response.status_code}")
                print(f"   错误: {response.text}")
                
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Cleanup
        if test_file.exists():
            test_file.unlink()
        if 'upload_result' in locals():
            uploaded_path = Path(upload_result['file_path'])
            if uploaded_path.exists():
                uploaded_path.unlink()


async def test_file_base64_mode():
    """Test without text (file base64 mode)."""
    print("\n\n" + "=" * 70)
    print("测试 2: 文件 Base64 模式 (text 为空)")
    print("=" * 70)
    
    # Create a test file
    test_file = Path("test_base64_mode.txt")
    test_content = "机器学习是人工智能的重要分支。这个测试验证文件 Base64 模式。"
    test_file.write_text(test_content, encoding="utf-8")
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            # 1. Upload file
            print("\n📤 上传文件...")
            with open(test_file, "rb") as f:
                files = {"file": (test_file.name, f, "text/plain")}
                response = await client.post(
                    "http://localhost:8000/api/v1/upload",
                    files=files
                )
                response.raise_for_status()
                upload_result = response.json()
            
            print(f"✅ 上传成功: {upload_result['file_path']}")
            
            # 2. Call humanize-file without text (file base64 mode)
            print("\n🤖 调用 humanize-file (文件 Base64 模式)...")
            payload = {
                "file_path": upload_result['file_path'],
                "text": "",  # 空文本,触发 base64 模式
                "params": {
                    "length": "Normal",
                    "similarity": "Moderate",
                    "style": "Professional"
                }
            }
            
            response = await client.post(
                "http://localhost:8000/api/v1/humanize-file",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ 成功!")
                print(f"   处理时间: {result['processingTime']}ms")
                print(f"   输出: {result['content'][:100]}...")
            else:
                print(f"❌ 失败: {response.status_code}")
                print(f"   错误: {response.text}")
                
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Cleanup
        if test_file.exists():
            test_file.unlink()
        if 'upload_result' in locals():
            uploaded_path = Path(upload_result['file_path'])
            if uploaded_path.exists():
                uploaded_path.unlink()


async def main():
    """Run all tests."""
    print("\n🧪 测试两种模式\n")
    print("确保后端服务正在运行: ./start-backend.sh")
    print()
    
    await test_text_mode()
    await test_file_base64_mode()
    
    print("\n\n" + "=" * 70)
    print("✅ 测试完成!")
    print("=" * 70)
    print("\n两种模式:")
    print("1. 文本模式: text 不为空 → 使用提取的文本")
    print("2. Base64 模式: text 为空 → 使用文件的 Base64 编码")
    print()


if __name__ == "__main__":
    asyncio.run(main())

