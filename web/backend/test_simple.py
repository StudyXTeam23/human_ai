"""简单测试两种模式的区别"""
import json

# 模拟请求
request_text_mode = {
    "file_path": "/path/to/file.txt",
    "text": "人工智能正在改变世界",  # 有文本
    "params": {
        "length": "Normal",
        "similarity": "Moderate",
        "style": "Friendly"
    }
}

request_base64_mode = {
    "file_path": "/path/to/file.txt",
    "text": "",  # 无文本
    "params": {
        "length": "Normal",
        "similarity": "Moderate",
        "style": "Friendly"
    }
}

print("=" * 70)
print("两种模式示例")
print("=" * 70)

print("\n📝 模式 1: 文本模式 (text 不为空)")
print("-" * 70)
print(json.dumps(request_text_mode, indent=2, ensure_ascii=False))
print("\n结果: 使用提取的文本进行人性化")
print("优点: 快速,高效,成本低")

print("\n📝 模式 2: Base64 模式 (text 为空)")
print("-" * 70)
print(json.dumps(request_base64_mode, indent=2, ensure_ascii=False))
print("\n结果: 将文件转为 Base64 发送给 OpenAI")
print("优点: 保留完整文件信息,适合复杂格式")

print("\n" + "=" * 70)
print("✅ 自动选择逻辑:")
print("=" * 70)
print("if request.text and request.text.strip():")
print("    # 使用文本模式")
print("    openai_service.humanize(text=request.text, file_data=None)")
print("else:")
print("    # 使用 Base64 模式")
print("    openai_service.humanize(text='', file_data={...})")
print()
