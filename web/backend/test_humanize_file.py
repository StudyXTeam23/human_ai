"""Test the humanize-file endpoint."""
import asyncio
import httpx
from pathlib import Path


async def test_humanize_file():
    """Test the humanize-file API endpoint."""
    
    # First, upload a file to get the file path
    test_content = """人工智能(Artificial Intelligence, AI)是计算机科学的一个分支,致力于创建能够执行通常需要人类智能才能完成的任务的系统。这些任务包括视觉感知、语音识别、决策制定和语言翻译等。近年来,随着深度学习和神经网络技术的发展,人工智能取得了突破性进展。从自动驾驶汽车到智能助手,从医疗诊断到金融分析,AI正在改变我们生活和工作的方方面面。然而,随着技术的快速发展,我们也需要关注AI带来的伦理和社会问题,确保技术的发展能够造福全人类。机器学习是人工智能的核心技术之一,它使计算机能够从数据中学习和改进,而无需明确编程。通过分析大量数据,机器学习算法可以识别模式、做出预测并不断优化其性能。深度学习是机器学习的一个子集,它使用人工神经网络来模拟人脑的工作方式,在图像识别、自然语言处理和语音识别等领域取得了显著成果。"""
    
    # Save test file
    test_file = Path("test_humanize_file.txt")
    test_file.write_text(test_content, encoding="utf-8")
    
    print("=" * 60)
    print("测试 humanize-file 接口")
    print("=" * 60)
    print()
    
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            # Step 1: Upload file
            print("📤 步骤 1: 上传文件")
            with open(test_file, "rb") as f:
                files = {"file": (test_file.name, f, "text/plain")}
                upload_response = await client.post(
                    "http://localhost:8000/api/v1/upload",
                    files=files
                )
            
            if upload_response.status_code != 200:
                print(f"❌ 上传失败: {upload_response.status_code}")
                print(upload_response.text)
                return
            
            upload_data = upload_response.json()
            file_path = upload_data.get("file_path")
            extracted_text = upload_data.get("text")
            
            print(f"✅ 上传成功!")
            print(f"   文件路径: {file_path}")
            print(f"   提取字符数: {upload_data['chars']}")
            print()
            
            # Step 2: Humanize file using the new endpoint
            print("🤖 步骤 2: 调用 humanize-file 接口")
            print(f"   发送文件路径: {file_path}")
            
            humanize_payload = {
                "file_path": file_path,
                "text": extracted_text,
                "params": {
                    "length": "Normal",
                    "similarity": "Moderate",
                    "style": "Friendly"
                }
            }
            
            humanize_response = await client.post(
                "http://localhost:8000/api/v1/humanize-file",
                json=humanize_payload
            )
            
            if humanize_response.status_code != 200:
                print(f"❌ 处理失败: {humanize_response.status_code}")
                print(humanize_response.text)
                return
            
            result = humanize_response.json()
            
            print(f"✅ 处理成功!")
            print(f"   输出字符数: {result['chars']}")
            print(f"   处理时间: {result['processingTime']}ms")
            print()
            print("📝 人性化后的文本:")
            print("-" * 60)
            print(result['content'])
            print("-" * 60)
            print()
            
            # Step 3: Compare with regular humanize endpoint
            print("🔄 步骤 3: 对比常规 humanize 接口")
            
            regular_payload = {
                "source": {
                    "mode": "document",
                    "text": extracted_text
                },
                "params": {
                    "length": "Normal",
                    "similarity": "Moderate",
                    "style": "Friendly"
                }
            }
            
            regular_response = await client.post(
                "http://localhost:8000/api/v1/humanize",
                json=regular_payload
            )
            
            if regular_response.status_code == 200:
                regular_result = regular_response.json()
                print(f"✅ 常规接口也成功")
                print(f"   输出字符数: {regular_result['chars']}")
                print(f"   处理时间: {regular_result['processingTime']}ms")
                print()
                print(f"📊 对比:")
                print(f"   humanize-file: {result['chars']} 字符, {result['processingTime']}ms")
                print(f"   humanize:      {regular_result['chars']} 字符, {regular_result['processingTime']}ms")
            
    except httpx.ConnectError:
        print("❌ 无法连接到后端服务")
        print("   请确保后端服务正在运行: ./start-backend.sh")
    except Exception as e:
        import traceback
        print(f"❌ 错误: {e}")
        print(traceback.format_exc())
    
    finally:
        # Clean up test file
        if test_file.exists():
            test_file.unlink()
            print(f"\n🗑️  清理测试文件: {test_file}")


if __name__ == "__main__":
    asyncio.run(test_humanize_file())

