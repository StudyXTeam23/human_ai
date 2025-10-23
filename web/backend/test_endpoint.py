"""Test the complete humanize endpoint."""
import asyncio
import httpx


async def test_humanize_endpoint():
    """Test the humanize API endpoint."""
    
    # Test data
    payload = {
        "source": {
            "text": "人工智能(Artificial Intelligence, AI)是计算机科学的一个分支,致力于创建能够执行通常需要人类智能才能完成的任务的系统。这些任务包括视觉感知、语音识别、决策制定和语言翻译等。近年来,随着深度学习和神经网络技术的发展,人工智能取得了突破性进展。从自动驾驶汽车到智能助手,从医疗诊断到金融分析,AI正在改变我们生活和工作的方方面面。然而,随着技术的快速发展,我们也需要关注AI带来的伦理和社会问题,确保技术的发展能够造福全人类。机器学习是人工智能的核心技术之一,它使计算机能够从数据中学习和改进,而无需明确编程。通过分析大量数据,机器学习算法可以识别模式、做出预测并不断优化其性能。",
            "type": "text",
            "mode": "text"
        },
        "params": {
            "length": "Normal",
            "similarity": "Moderate",
            "style": "Friendly"
        }
    }
    
    api_url = "http://localhost:8000/api/v1/humanize"
    
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            print(f"Testing endpoint: {api_url}")
            print(f"\nInput text (length: {len(payload['source']['text'])}):")
            print(f"{payload['source']['text'][:100]}...\n")
            print(f"Parameters:")
            print(f"  Length: {payload['params']['length']}")
            print(f"  Similarity: {payload['params']['similarity']}")
            print(f"  Style: {payload['params']['style']}\n")
            print("Sending request... (this may take 5-10 seconds)\n")
            
            response = await client.post(api_url, json=payload)
            
            print(f"Status Code: {response.status_code}\n")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Success!")
                print(f"\nHumanized text (length: {result['chars']}):")
                print("-" * 60)
                print(result['content'])
                print("-" * 60)
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
    except httpx.TimeoutException:
        print("❌ Request timeout - the server might be down or slow")
    except httpx.ConnectError:
        print("❌ Connection error - is the backend running?")
        print("   Run: ./start-backend.sh")
    except Exception as e:
        import traceback
        print(f"❌ Error: {e}")
        print(traceback.format_exc())


if __name__ == "__main__":
    print("=" * 60)
    print("AI Text Humanizer - Endpoint Test")
    print("=" * 60)
    print()
    asyncio.run(test_humanize_endpoint())

