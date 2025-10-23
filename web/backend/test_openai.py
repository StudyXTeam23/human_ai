"""Test OpenAI API integration."""
import asyncio
import httpx


async def test_openai():
    """Test OpenAI API call."""
    api_key = "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"
    api_url = "https://api.openai.com/v1/chat/completions"
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Say hello!"
            }
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            print(f"Calling OpenAI API: {api_url}")
            response = await client.post(api_url, json=payload, headers=headers)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"\nSuccess! Response:")
                print(result["choices"][0]["message"]["content"])
            else:
                print(f"\nError: {response.status_code}")
                
    except Exception as e:
        import traceback
        print(f"Error: {e}")
        print(traceback.format_exc())


if __name__ == "__main__":
    asyncio.run(test_openai())

