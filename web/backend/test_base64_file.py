"""Test file upload with Base64 encoding to OpenAI."""
import asyncio
import httpx
import os
from pathlib import Path


async def test_base64_file_upload():
    """Test the complete flow: upload file, then humanize with base64."""
    
    print("=" * 70)
    print("测试文件上传 + Base64 传递给 OpenAI")
    print("=" * 70)
    
    # Step 1: Create a test file
    test_content = """人工智能技术报告

1. 概述
人工智能(AI)是当前最具影响力的技术之一,正在改变各行各业的运作方式。

2. 主要应用领域
- 自然语言处理
- 计算机视觉
- 机器学习
- 深度学习

3. 未来展望
随着算力的提升和算法的优化,AI将在更多领域发挥重要作用。"""
    
    test_filename = "test_base64.txt"
    test_file_path = Path(test_filename)
    test_file_path.write_text(test_content, encoding="utf-8")
    
    upload_url = "http://localhost:18201/api/v1/upload"
    humanize_file_url = "http://localhost:18201/api/v1/humanize-file"
    
    uploaded_file_path = None
    extracted_text = None
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            # Step 2: Upload file
            print("\n📤 步骤 1: 上传文件")
            print(f"   文件: {test_filename}")
            print(f"   大小: {len(test_content)} 字节")
            
            with open(test_file_path, "rb") as f:
                files = {"file": (test_filename, f, "text/plain")}
                response = await client.post(upload_url, files=files)
                response.raise_for_status()
                upload_result = response.json()
            
            uploaded_file_path = upload_result["file_path"]
            extracted_text = upload_result["text"]
            
            print("✅ 上传成功!")
            print(f"   服务器路径: {uploaded_file_path}")
            print(f"   提取字符数: {upload_result['chars']}")
            print(f"   Base64 长度: {len(upload_result['base64'])} 字符")
            
            # Step 3: Call humanize-file (which will use base64)
            print("\n🤖 步骤 2: 调用 humanize-file 接口 (使用 Base64)")
            print("   此接口会:")
            print("   1. 读取上传的文件")
            print("   2. 将文件转为 Base64")
            print("   3. 以 Base64 格式传递给 OpenAI API")
            
            payload = {
                "file_path": uploaded_file_path,
                "text": extracted_text,
                "params": {
                    "length": "Normal",
                    "similarity": "Moderate",
                    "style": "Friendly"
                }
            }
            
            print(f"\n   发送请求...")
            response = await client.post(humanize_file_url, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                print("\n✅ 处理成功!")
                print(f"   输出字符数: {result['chars']}")
                print(f"   处理时间: {result['processingTime']}ms")
                print("\n📝 人性化后的文本:")
                print("─" * 70)
                print(result["content"])
                print("─" * 70)
                
                print("\n🎉 测试通过!")
                print("   文件已成功通过 Base64 编码传递给 OpenAI API")
            else:
                print(f"\n❌ 处理失败: {response.status_code}")
                print(f"   错误: {response.text}")
                
    except httpx.HTTPStatusError as e:
        print(f"\n❌ HTTP 错误: {e.response.status_code}")
        print(f"   详情: {e.response.text}")
    except httpx.ConnectError:
        print("\n❌ 连接错误")
        print("   可能原因:")
        print("   1. 后端服务未启动")
        print("   2. 代理设置有问题")
        print("\n   解决方法:")
        print("   1. 确保后端正在运行: ./start-backend.sh")
        print("   2. 检查代理: netstat -an | grep 7890")
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        import traceback
        print(traceback.format_exc())
    finally:
        # Cleanup
        print("\n🗑️  清理测试文件...")
        if test_file_path.exists():
            os.remove(test_file_path)
            print(f"   已删除: {test_filename}")
        
        if uploaded_file_path and Path(uploaded_file_path).exists():
            os.remove(Path(uploaded_file_path))
            print(f"   已删除: {uploaded_file_path}")
        
        print("\n✅ 清理完成")


if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🧪 Base64 文件传递测试")
    print("=" * 70)
    print("\n此测试验证:")
    print("1. 文件上传到服务器")
    print("2. 文件内容转换为 Base64")
    print("3. Base64 内容传递给 OpenAI API")
    print("4. OpenAI 返回人性化后的文本")
    print()
    
    asyncio.run(test_base64_file_upload())

