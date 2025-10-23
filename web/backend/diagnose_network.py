"""Diagnose network connectivity to OpenAI API."""
import asyncio
import httpx
import os
import socket
from app.config import settings


async def test_direct_connection():
    """Test direct connection without httpx."""
    print("=" * 60)
    print("1. 测试 DNS 解析")
    print("=" * 60)
    try:
        ip = socket.gethostbyname("api.openai.com")
        print(f"✅ api.openai.com 解析为: {ip}")
    except Exception as e:
        print(f"❌ DNS 解析失败: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("2. 测试环境变量")
    print("=" * 60)
    proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']
    has_proxy = False
    for var in proxy_vars:
        value = os.environ.get(var)
        if value:
            print(f"⚠️  {var} = {value}")
            has_proxy = True
        else:
            print(f"✅ {var} = (未设置)")
    
    if not has_proxy:
        print("\n✅ 未检测到代理环境变量")
    
    print("\n" + "=" * 60)
    print("3. 测试 httpx 连接 (trust_env=False)")
    print("=" * 60)
    
    # Clear all proxy settings
    for var in proxy_vars:
        os.environ.pop(var, None)
    
    try:
        async with httpx.AsyncClient(timeout=30.0, trust_env=False) as client:
            print("正在连接到 OpenAI API...")
            response = await client.get("https://api.openai.com/v1/models", headers={
                "Authorization": f"Bearer {settings.openai_api_key}"
            })
            print(f"✅ 连接成功! 状态码: {response.status_code}")
            if response.status_code == 200:
                print(f"✅ API 密钥有效")
                return True
            else:
                print(f"⚠️  API 响应异常: {response.text[:200]}")
                return False
    except httpx.ConnectError as e:
        print(f"❌ 连接错误: {e}")
        print(f"   错误类型: {type(e).__name__}")
        return False
    except Exception as e:
        print(f"❌ 未知错误: {e}")
        import traceback
        print(traceback.format_exc())
        return False
    
    print("\n" + "=" * 60)
    print("4. 测试简单的 HTTP 请求")
    print("=" * 60)
    try:
        async with httpx.AsyncClient(timeout=10.0, trust_env=False) as client:
            response = await client.get("https://www.google.com")
            print(f"✅ 可以连接到 Google: {response.status_code}")
    except Exception as e:
        print(f"❌ 无法连接到 Google: {e}")


async def test_openai_chat():
    """Test OpenAI chat completion."""
    print("\n" + "=" * 60)
    print("5. 测试 OpenAI Chat Completion")
    print("=" * 60)
    
    # Clear proxies
    for var in ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']:
        os.environ.pop(var, None)
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "user", "content": "Say hello"}
        ],
        "max_tokens": 10
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.openai_api_key}"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0, trust_env=False) as client:
            print("发送 Chat Completion 请求...")
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ 成功! 响应: {result['choices'][0]['message']['content']}")
                return True
            else:
                print(f"❌ 失败: {response.status_code}")
                print(f"   错误: {response.text}")
                return False
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        print(traceback.format_exc())
        return False


async def main():
    """Run all diagnostics."""
    print("\n🔍 开始网络诊断...\n")
    
    result1 = await test_direct_connection()
    result2 = await test_openai_chat()
    
    print("\n" + "=" * 60)
    print("诊断总结")
    print("=" * 60)
    if result1 and result2:
        print("✅ 所有测试通过! 网络连接正常。")
        print("\n建议: 后端应该可以正常工作。如果还有问题,请重启后端服务。")
    else:
        print("❌ 部分测试失败。")
        print("\n可能的原因:")
        print("1. 网络防火墙阻止了连接")
        print("2. 系统代理设置有问题")
        print("3. VPN 或安全软件干扰")
        print("\n建议:")
        print("1. 检查系统网络设置")
        print("2. 尝试关闭 VPN")
        print("3. 检查防火墙设置")


if __name__ == "__main__":
    asyncio.run(main())

