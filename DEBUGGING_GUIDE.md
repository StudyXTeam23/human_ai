# 调试指南 - 文件上传后 Humanize 无反应

## 🔍 调试步骤

### 1. 打开浏览器开发者工具

**Chrome/Edge**:
- Windows/Linux: `F12` 或 `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**Firefox**:
- Windows/Linux: `F12` 或 `Ctrl+Shift+K`
- Mac: `Cmd+Option+K`

### 2. 切换到 Console 标签页

查看控制台输出的调试信息。

### 3. 上传文件并观察日志

上传文件后,您应该看到:

```
File processed: { textLength: 365, filename: "test.txt" }
```

### 4. 点击 Humanize 按钮并观察日志

点击后,您应该看到:

```
Form submitted: {
  mode: "document",
  textLength: 365,
  count: 365,
  isTooShort: false,
  isTooLong: false
}
```

## 🐛 可能的问题及解决方案

### 问题 1: 没有看到 "File processed" 日志

**原因**: 文件上传失败

**检查**:
1. Network 标签是否显示上传请求
2. 上传请求是否返回 200 OK
3. 是否有错误提示

**解决**:
- 确保后端服务正在运行
- 检查文件类型和大小是否符合要求
- 查看后端日志是否有错误

### 问题 2: 看到 "File processed" 但按钮仍然禁用

**原因**: 字符计数验证失败

**检查日志显示的值**:
```
File processed: { textLength: 365, filename: "test.txt" }
```

**检查界面显示**:
- 已提取 XXX 个字符 (太短) ← 如果看到这个,说明 < 300
- 已提取 XXX 个字符 (太长) ← 如果看到这个,说明 > 5000

**解决**:
- 如果显示 "太短": 文件内容少于 300 字符,需要更多内容
- 如果显示 "太长": 文件内容超过 5000 字符,会被自动截断

### 问题 3: 点击按钮没有 "Form submitted" 日志

**可能原因**:
1. 按钮仍然被禁用
2. 表单验证失败
3. JavaScript 错误

**检查**:
1. 按钮是否可点击 (不是灰色)
2. Console 是否有红色错误信息
3. 检查按钮的 disabled 属性

**当前的禁用逻辑**:
```typescript
disabled={isLoading || (text && (isTooShort || isTooLong)) || (!text)}
```

按钮会在以下情况被禁用:
- `isLoading`: 正在处理中
- `!text`: 没有文本内容
- `isTooShort`: 文本少于 300 字符
- `isTooLong`: 文本超过 5000 字符

### 问题 4: 看到 "Form submitted" 但没有结果

**原因**: API 调用失败

**检查**:
1. Network 标签中的 `/api/v1/humanize` 请求
2. 请求状态码 (200 = 成功)
3. 响应内容

**常见错误**:
- **400**: 请求参数错误
- **500**: 服务器错误
- **网络错误**: 后端未运行或 CORS 问题

## 📊 正常流程的日志示例

### 完整的成功流程

```javascript
// 1. 上传文件
File processed: { textLength: 365, filename: "test.txt" }

// 2. 点击 Humanize
Form submitted: {
  mode: "document",
  textLength: 365,
  count: 365,
  isTooShort: false,
  isTooLong: false
}

// 3. Network 标签应该显示
POST /api/v1/humanize 200 OK

// 4. 看到成功提示
Toast: "文档 'test.txt' 已成功处理"
```

## 🔧 手动测试按钮状态

在 Console 中运行:

```javascript
// 检查按钮状态
const button = document.querySelector('button[type="submit"]');
console.log({
  disabled: button.disabled,
  text: button.textContent,
  classList: Array.from(button.classList)
});
```

## 🛠️ 快速修复检查清单

- [ ] 前端服务正在运行 (http://localhost:3000)
- [ ] 后端服务正在运行 (http://localhost:8000)
- [ ] 浏览器已刷新页面
- [ ] 文件上传成功 (看到 "File processed" 日志)
- [ ] 显示 "已提取 XXX 个字符" (没有 "太短" 或 "太长")
- [ ] Humanize 按钮不是灰色
- [ ] Console 没有红色错误信息
- [ ] Network 标签显示请求发送成功

## 📝 收集信息

如果问题仍然存在,请提供:

1. **Console 日志**:
   - File processed 的输出
   - Form submitted 的输出
   - 任何错误信息

2. **Network 信息**:
   - 上传请求的状态码和响应
   - humanize 请求的状态码和响应

3. **界面状态**:
   - "已提取 XXX 个字符" 显示的数字
   - 按钮是否可点击
   - 是否有任何错误提示

4. **测试文件信息**:
   - 文件类型
   - 文件大小
   - 文件内容的字符数

## 🔄 重新开始测试

如果需要重新开始:

1. **清除状态**:
```javascript
// 在 Console 中运行
localStorage.clear();
location.reload();
```

2. **重启前端**:
```bash
# Ctrl+C 停止前端
./start-frontend.sh
```

3. **重启后端**:
```bash
# Ctrl+C 停止后端
./start-backend.sh
```

## 💡 常见解决方案

### 方案 1: 刷新页面

最简单的方法,通常能解决缓存问题:
- Mac: `Cmd+Shift+R`
- Windows/Linux: `Ctrl+Shift+R`

### 方案 2: 清除浏览器缓存

Settings → Privacy → Clear browsing data

### 方案 3: 使用无痕模式

测试是否是缓存或扩展程序的问题

### 方案 4: 检查文件内容

确保文件内容 ≥ 300 字符:

```bash
# 检查文件字符数
wc -m test.txt

# 或者在 Python 中
python -c "print(len(open('test.txt').read()))"
```

---

**如果以上方法都不能解决问题,请提供 Console 的完整日志输出**

