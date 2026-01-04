# 🔧 MongoDB 配置指南 | MongoDB Setup Guide

## 📝 快速设置步骤

### 1. 复制环境变量模板

```bash
cp .env.example .env
```

### 2. 编辑 .env 文件

使用任何文本编辑器打开 `.env` 文件并替换 MongoDB 连接字符串：

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/film-survey?retryWrites=true&w=majority
PORT=3000
```

**替换以下内容：**
- `your_username` → 你的 MongoDB 用户名
- `your_password` → 你的 MongoDB 密码  
- `your_cluster` → 你的集群地址

### 3. 获取 MongoDB 连接字符串

#### 方法 A：从已有的 MongoDB Atlas 集群

1. 登录 https://cloud.mongodb.com/v2/69227fb5855ab04fdf80a74a
2. 左侧菜单 → **Database**
3. 点击集群的 "Connect" 按钮
4. 选择 "Connect your application"
5. 复制连接字符串
6. 粘贴到 `.env` 文件中的 `MONGODB_URI=` 后面

#### 方法 B：创建新的免费集群

详见 `DEPLOYMENT.md` 中的完整步骤。

---

## ✅ 验证连接

### 运行服务器

```bash
npm start
```

### 检查输出

✅ **成功连接 MongoDB：**
```
✅ Connected to MongoDB successfully!
💾 Database: MongoDB Cloud
```

❌ **连接失败（使用本地JSON）：**
```
❌ MongoDB connection error: ...
⚠️  Falling back to local JSON storage
💾 Database: Local JSON
```

### 访问健康检查端点

浏览器打开：`http://localhost:3000/api/health`

应该看到：
```json
{
  "status": "ok",
  "mongodb": "connected",  // 或 "disconnected"
  "timestamp": "2026-01-04T..."
}
```

---

## 🔍 常见问题排查

### 问题 1：连接被拒绝 (ECONNREFUSED)

**原因：** MongoDB URI 使用了本地地址 `localhost:27017`

**解决：** 
1. 确保 `.env` 文件中的 `MONGODB_URI` 以 `mongodb+srv://` 开头
2. 不要使用 `mongodb://localhost:27017`

### 问题 2：认证失败 (Authentication failed)

**原因：** 用户名或密码错误

**解决：**
1. 检查用户名和密码是否正确
2. 密码中如果有特殊字符，需要URL编码：
   - `@` → `%40`
   - `:` → `%3A`
   - `/` → `%2F`
   - `#` → `%23`
   - `?` → `%3F`

### 问题 3：网络超时 (Network timeout)

**原因：** IP 地址未加入白名单

**解决：**
1. MongoDB Atlas → Network Access
2. 添加 IP: `0.0.0.0/0`（允许所有）
3. 或添加你的当前IP地址

### 问题 4：数据库名称错误

**确保连接字符串格式：**
```
mongodb+srv://username:password@cluster.mongodb.net/film-survey?...
                                                      ^^^^^^^^^^^
                                                      数据库名称
```

---

## 🎯 完整示例

### 示例 .env 文件

```env
# MongoDB Atlas 连接（推荐用于生产环境）
MONGODB_URI=mongodb+srv://filmsurvey:MyP%40ssw0rd@cluster0.abc123.mongodb.net/film-survey?retryWrites=true&w=majority

# 服务器端口
PORT=3000
```

### 示例连接字符串解析

```
mongodb+srv://filmsurvey:MyP%40ssw0rd@cluster0.abc123.mongodb.net/film-survey?retryWrites=true&w=majority
│           │          │               │                          │            │
│           │          │               │                          │            └─ 查询参数
│           │          │               │                          └─ 数据库名称
│           │          │               └─ 集群地址
│           │          └─ 密码（URL编码）
│           └─ 用户名
└─ 协议（使用 SRV 记录）
```

---

## 💡 开发建议

### 本地开发

在开发过程中，如果不需要 MongoDB，可以留空或注释掉 `MONGODB_URI`：

```env
# MONGODB_URI=
PORT=3000
```

系统会自动使用本地 JSON 文件存储。

### 生产部署

**必须**设置 MongoDB URI 以确保数据持久化和多实例支持。

---

## 📊 数据库结构

### 数据库名称
`film-survey`

### 集合（Collections）

#### `responses`
存储所有问卷回复

**索引：**
- `timestamp` (降序) - 用于按时间排序
- `id` (唯一) - 确保每个回复ID唯一

**示例文档：**
```json
{
  "_id": "ObjectId(...)",
  "id": 1704355200000,
  "timestamp": "2026-01-04T12:00:00.000Z",
  "consent": "yes",
  "nativeLanguage": "chinese",
  "age": "18-25",
  "frequency": "3",
  "zootopia_watched": "yes",
  "zootopia_easy": "5",
  "zootopia_attractive": "4",
  ...
}
```

---

## 🔐 安全最佳实践

1. ✅ **永远不要**提交 `.env` 文件到 Git
2. ✅ 使用强密码（至少12位，包含大小写字母、数字、特殊字符）
3. ✅ 为不同环境使用不同的数据库用户
4. ✅ 定期轮换密码
5. ✅ 限制数据库用户权限（只给必要的读写权限）

---

## 📞 需要帮助？

- MongoDB 官方文档: https://docs.mongodb.com/manual/
- Connection String 格式: https://docs.mongodb.com/manual/reference/connection-string/
- Atlas 快速入门: https://docs.atlas.mongodb.com/getting-started/

---

**祝配置顺利！🎉**
