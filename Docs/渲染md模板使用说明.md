# Markdown 渲染模板使用说明

## 效果

可直接将 markdown 渲染成 html 网页，直接以带参 URL 的形式

## 🚀 使用方法

### 方法 ：URL 参数完整说明

模板支持以下 URL 参数：

| 参数 | 说明 | 示例 | 默认值 |
|------|------|------|--------|
| `file` 或 `id` | 文件 ID | `?file=guide` | `guide` |
| `domain` | 服务器域名 | `?domain=https://qbin.me` | `https://mpin.tsmoe.com` |
| `pwd` 或 `password` | 访问密码 | `?pwd=123456` | 无 |

**示例：**

```
# 加载默认文件
https://mpin.tsmoe.com/r/mdviewer

# 加载指定文件
https://mpin.tsmoe.com/r/mdviewer?file=document

# 加载需要密码的文件
https://mpin.tsmoe.com/r/mdviewer?file=secret&pwd=mypassword

# 从其他域名加载
https://mpin.tsmoe.com/r/mdviewer?file=doc&domain=https://qbin.me
```

## ✨ 功能特性

### 1. 自动渲染
- ✅ GitHub 风格 Markdown
- ✅ 代码语法高亮
- ✅ 表格支持
- ✅ 图片自适应
- ✅ 数学公式（如需要可添加 KaTeX）

### 2. 智能缓存
- ✅ 24小时本地缓存
- ✅ 加速二次访问
- ✅ 可配置开关

### 3. 实用工具栏
- 🖨️ **打印**：直接打印文档
- 📋 **复制**：复制 Markdown 原文
- ⬆️ **顶部**：快速回到顶部

### 4. 响应式设计
- 📱 完美适配移动端
- 💻 桌面端大屏优化
- 🖨️ 打印友好布局

---

## 📝 实际应用场景

### 场景 1：团队文档分享
1. 用 Markdown 编辑器写文档
2. 保存为 `team-guide`
3. 分享链接：`https://mpin.tsmoe.com/r/mdviewer?file=team-guide`
4. 团队成员直接在浏览器查看，无需下载

### 场景 2：个人知识库
```
博客文章：?file=blog-post-001
技术笔记：?file=tech-notes
学习资料：?file=learning-resources
```

### 场景 3：项目文档
```
API文档：?file=api-docs
使用教程：?file=user-guide
更新日志：?file=changelog
```

### 场景 4：嵌入其他网站
```html
<iframe 
  src="https://mpin.tsmoe.com/r/mdviewer?file=guide" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>
```

---

## 🎨 自定义样式

如果想修改外观，可以编辑 `<style>` 标签中的 CSS：

```css
/* 修改主题色 */
.toolbar button {
    background: #e74c3c;  /* 改为红色 */
}

/* 修改字体 */
body {
    font-family: '微软雅黑', sans-serif;
}

/* 修改最大宽度 */
.container {
    max-width: 1200px;  /* 更宽的布局 */
}
```

---

## 🔧 高级用法

### 1. 禁用缓存（总是获取最新内容）
修改配置：
```javascript
enableCache: false
```

### 2. 添加自定义脚本
在 `</body>` 前添加：
```html
<script>
// 你的自定义 JavaScript
console.log('文档已加载');
</script>
```

---

## 📚 完整工作流示例

### 创建一个使用教程页面

**步骤 1**：编写 Markdown 文档
- 打开 MPin Markdown 编辑器
- 写你的教程内容
- 设置访问路径名 `tutorial`

**步骤 2**：分享
- 直接访问：`https://mpin.tsmoe.com/r/mdviwer?file=tutorial`
- 自动渲染 `tutorial` 的内容为 html 网页
- 用户看到美观的文档页面

---

## 💡 提示

1. **首次加载较慢**：因为需要下载 CDN 资源（marked.js, highlight.js）
2. **后续访问很快**：浏览器会缓存这些库
3. **可以离线使用**：启用缓存后，24小时内可离线查看
4. **支持所有 Markdown 语法**：包括 GFM（GitHub Flavored Markdown）

---

## 🆘 常见问题

**Q: 为什么显示"加载失败"？**
- 检查文件 ID 是否正确
- 检查文件是否存在
- 检查是否需要密码

**Q: 如何修改缓存时间？**
```javascript
cacheExpiry: 1 * 60 * 60 * 1000,  // 改为 1 小时
```

**Q: 如何清除缓存？**
- 按 F12 打开开发者工具
- Console 中输入：`localStorage.clear()`
- 或者在 URL 加上 `?t=123456` 强制刷新

**Q: 支持哪些代码高亮语言？**
- 支持 180+ 种语言
- 包括：JavaScript, Python, Java, C++, Go, Rust 等

---

## 🎯 总结

这个模板让您可以：
- ✅ 用 Markdown 写内容（简单）
- ✅ 用 HTML 展示内容（美观）
- ✅ 通过 URL 参数灵活控制
- ✅ 一次创建，多次使用
- ✅ 完全托管在 MPin 上

**就像拥有了一个轻量级的文档系统！** 🚀

