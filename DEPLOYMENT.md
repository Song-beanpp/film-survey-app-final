# 🚀 免费部署指南 | Free Deployment Guide

## 📋 准备工作 | Prerequisites

1. ✅ MongoDB Atlas 账号（免费）
2. ✅ GitHub 账号（免费）
3. ✅ Vercel 或 Railway 账号（免费）

---

## 第一步：设置 MongoDB Atlas（免费云数据库）

### 1. 创建账号和集群

1. 访问 https://cloud.mongodb.com 并注册
2. 点击 "Build a Database"
3. 选择 **FREE** 的 M0 Sandbox 套餐
4. 选择云服务商（推荐 AWS）和区域（选择离中国最近的，如 Singapore）
5. 点击 "Create Cluster"

### 2. 创建数据库用户

1. 左侧菜单 → **Database Access**
2. 点击 "Add New Database User"
3. 选择 "Password" 认证方式
4. 设置用户名和密码（**记住这些！**）
5. User Privileges 选择 "Read and write to any database"
6. 点击 "Add User"

### 3. 设置网络访问

1. 左侧菜单 → **Network Access**
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere" （0.0.0.0/0）
4. 点击 "Confirm"

### 4. 获取连接字符串

1. 左侧菜单 → **Database** → 点击 "Connect"
2. 选择 "Connect your application"
3. Driver 选择 "Node.js" 和最新版本
4. 复制连接字符串，格式类似：
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. 将 `<password>` 替换为你的实际密码
6. 在 `mongodb.net/` 后面添加数据库名：`film-survey`
   
   最终格式：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/film-survey?retryWrites=true&w=majority
   ```

---

## 第二步：推送代码到 GitHub

### 1. 创建 GitHub 仓库

1. 访问 https://github.com 并登录
2. 点击右上角 "+" → "New repository"
3. Repository name: `film-survey-app`
4. 选择 "Public"
5. **不要** 勾选任何初始化选项
6. 点击 "Create repository"

### 2. 上传代码

在项目文件夹中打开终端，执行：

```bash
cd /Users/Zhuanz/.gemini/antigravity/scratch/film-survey-app

git init
git add .
git commit -m "Initial commit: Film Survey App"
git branch -M main
git remote add origin https://github.com/你的用户名/film-survey-app.git
git push -u origin main
```

---

## 第三步：部署到 Vercel（推荐，最简单）

### 1. 注册并连接 GitHub

1. 访问 https://vercel.com
2. 点击 "Sign Up" → 选择 "Continue with GitHub"
3. 授权 Vercel 访问你的 GitHub

### 2. 导入项目

1. 点击 "Add New..." → "Project"
2. 找到 `film-survey-app` 仓库
3. 点击 "Import"

### 3. 配置环境变量

在 "Configure Project" 页面：

1. 展开 "Environment Variables"
2. 添加环境变量：
   - **Name**: `MONGODB_URI`
   - **Value**: 粘贴你的 MongoDB 连接字符串
3. 点击 "Add"

### 4. 部署

1. 点击 "Deploy"
2. 等待 1-2 分钟
3. 部署成功后，你会得到一个免费域名，类似：
   ```
   https://film-survey-app-xxxxx.vercel.app
   ```

### 5. 自定义域名（可选）

1. 在项目设置中点击 "Domains"
2. 你可以添加自己的域名，或使用 Vercel 提供的免费域名

---

## 第四步：测试你的问卷

### 访问链接

- **问卷主页**: `https://你的域名.vercel.app`
- **管理后台**: `https://你的域名.vercel.app/admin.html`
- **导出CSV**: `https://你的域名.vercel.app/api/export/csv`

### 测试步骤

1. 打开问卷主页
2. 填写并提交一份测试问卷
3. 打开管理后台查看是否收到数据
4. 尝试导出 CSV

---

## 🎯 替代方案：Railway（另一个免费选项）

### 部署到 Railway

1. 访问 https://railway.app
2. 注册并登录（GitHub 登录）
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择 `film-survey-app` 仓库
5. 添加环境变量 `MONGODB_URI`
6. 点击 "Deploy"

Railway 会自动给你一个免费域名。

---

## 📊 查看和管理数据

### MongoDB Atlas 中查看数据

1. 登录 MongoDB Atlas
2. 点击你的集群 → "Browse Collections"
3. 你会看到 `film-survey` 数据库和 `responses` 集合
4. 可以直接在这里查看、搜索、导出数据

### 通过管理后台

1. 访问 `你的域名/admin.html`
2. 查看统计数据
3. 导出 CSV 或 JSON

---

## 🔒 安全建议

### 保护管理后台（可选）

如果担心管理后台被其他人访问，可以：

1. 为管理后台添加简单密码保护
2. 或者只在本地运行管理后台
3. 或者使用 Vercel 的访问控制功能

---

## 📱 分享问卷链接

部署成功后，你可以把链接分享给参与者：

```
https://你的域名.vercel.app
```

建议：
- ✅ 使用短链接服务（如 bit.ly）使链接更简洁
- ✅ 创建二维码方便手机扫描
- ✅ 在邮件或社交媒体中分享

---

## ❓ 常见问题

### Q: Vercel 部署失败怎么办？

A: 检查：
1. `package.json` 中是否有 `"start": "node server.js"`
2. 环境变量是否正确设置
3. MongoDB 连接字符串是否有效

### Q: 数据没有保存到 MongoDB？

A: 检查：
1. MongoDB URI 是否正确
2. 网络访问是否允许所有 IP（0.0.0.0/0）
3. 数据库用户是否有读写权限
4. 查看 Vercel 的 "Functions" 日志

### Q: 免费套餐有限制吗？

A: 
- **MongoDB Atlas M0**: 512MB 存储，足够数千份问卷
- **Vercel**: 无限流量，100GB/月带宽
- **Railway**: 500小时/月免费运行时间

### Q: 如何更新问卷内容？

A: 
1. 在本地修改代码
2. 提交到 GitHub: `git add . && git commit -m "Update" && git push`
3. Vercel 会自动重新部署（1-2分钟）

---

## 🎉 完成！

现在你有了：
- ✅ 一个美观的在线问卷
- ✅ 免费的云数据库存储
- ✅ 永久的免费域名
- ✅ 自动备份的数据
- ✅ 实时的管理后台

**祝你的研究顺利！Good luck with your research! 🍀**

---

## 💡 额外提示

### 备份数据

定期从管理后台导出 CSV 或 JSON 备份。

### 监控响应

MongoDB Atlas 提供免费的监控面板，可以看到：
- 实时连接数
- 数据库大小
- 查询性能

### 分析数据

导出的 CSV 可以直接导入：
- Excel
- SPSS
- Python (pandas)
- R

---

**需要帮助？**
- MongoDB 文档: https://docs.mongodb.com/
- Vercel 文档: https://vercel.com/docs
- Railway 文档: https://docs.railway.app/
