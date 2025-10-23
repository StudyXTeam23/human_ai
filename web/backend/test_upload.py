"""Test file upload endpoint."""
import asyncio
import httpx
from pathlib import Path


async def test_file_upload():
    """Test file upload endpoint."""
    
    # Create a test text file with enough content (>300 characters)
    test_content = """人工智能(Artificial Intelligence, AI)是计算机科学的一个分支,致力于创建能够执行通常需要人类智能才能完成的任务的系统。这些任务包括视觉感知、语音识别、决策制定和语言翻译等。近年来,随着深度学习和神经网络技术的发展,人工智能取得了突破性进展。从自动驾驶汽车到智能助手,从医疗诊断到金融分析,AI正在改变我们生活和工作的方方面面。然而,随着技术的快速发展,我们也需要关注AI带来的伦理和社会问题,确保技术的发展能够造福全人类。机器学习是人工智能的核心技术之一,它使计算机能够从数据中学习和改进,而无需明确编程。通过分析大量数据,机器学习算法可以识别模式、做出预测并不断优化其性能。深度学习是机器学习的一个子集,它使用人工神经网络来模拟人脑的工作方式,在图像识别、自然语言处理和语音识别等领域取得了显著成果。"""
    
    # Save test file
    test_file = Path("test_upload.txt")
    test_file.write_text(test_content, encoding="utf-8")
    
    print(f"✅ 创建测试文件: {test_file}")
    print(f"   文件大小: {test_file.stat().st_size} bytes")
    print(f"   文本长度: {len(test_content)} 字符\n")
    
    # Upload file
    api_url = "http://localhost:18201/api/v1/upload"
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            print(f"📤 上传文件到: {api_url}")
            
            with open(test_file, "rb") as f:
                files = {"file": (test_file.name, f, "text/plain")}
                response = await client.post(api_url, files=files)
            
            print(f"   状态码: {response.status_code}\n")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ 上传成功!")
                print(f"   文件名: {data['filename']}")
                print(f"   提取字符数: {data['chars']}")
                print(f"   文件大小: {data['size']} bytes")
                print(f"\n提取的文本预览:")
                print("-" * 60)
                print(data['text'][:200] + "...")
                print("-" * 60)
                print(f"\nBase64 长度: {len(data['base64'])} 字符")
                
                # Test humanize with extracted text
                print("\n" + "=" * 60)
                print("测试文本人性化处理...")
                print("=" * 60 + "\n")
                
                humanize_url = "http://localhost:18201/api/v1/humanize"
                payload = {
                    "source": {
                        "mode": "document",
                        "text": data['text']
                    },
                    "params": {
                        "length": "Normal",
                        "similarity": "Moderate",
                        "style": "Friendly"
                    }
                }
                
                print(f"📤 调用 Humanize API: {humanize_url}")
                humanize_response = await client.post(humanize_url, json=payload)
                
                if humanize_response.status_code == 200:
                    result = humanize_response.json()
                    print(f"✅ 处理成功!")
                    print(f"   输出字符数: {result['chars']}")
                    print(f"   处理时间: {result['processingTime']}ms")
                    print(f"\n人性化后的文本:")
                    print("-" * 60)
                    print(result['content'])
                    print("-" * 60)
                else:
                    print(f"❌ 人性化处理失败: {humanize_response.status_code}")
                    print(f"   错误: {humanize_response.text}")
                
            else:
                print(f"❌ 上传失败: {response.status_code}")
                print(f"   响应: {response.text}")
    
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
    print("=" * 60)
    print("文件上传功能测试")
    print("=" * 60)
    print()
    asyncio.run(test_file_upload())

