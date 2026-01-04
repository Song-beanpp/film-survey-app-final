#!/bin/bash

# 🎬 Film Survey - 快速配置脚本
# Quick Setup Script

echo "================================="
echo "🎬 Film Survey 快速配置向导"
echo "================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    echo "   cd /Users/Zhuanz/.gemini/antigravity/scratch/film-survey-app"
    exit 1
fi

# 提示输入MongoDB密码
echo "📝 请输入您的MongoDB数据库密码："
echo "   (您在 https://cloud.mongodb.com 中为用户 'Rain' 设置的密码)"
echo ""
read -s -p "密码: " DB_PASSWORD
echo ""

# 验证密码不为空
if [ -z "$DB_PASSWORD" ]; then
    echo "❌ 密码不能为空！"
    exit 1
fi

# 创建 .env 文件
echo ""
echo "📄 正在创建 .env 文件..."

cat > .env << EOF
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://Rain:${DB_PASSWORD}@cluster0.l6yhk4q.mongodb.net/film-survey?retryWrites=true&w=majority&appName=Cluster0

# Server Port
PORT=3000
EOF

echo "✅ .env 文件创建成功！"
echo ""

# 询问是否立即测试
read -p "🧪 是否立即测试MongoDB连接？(y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 正在启动服务器测试连接..."
    echo "   (按 Ctrl+C 停止)"
    echo ""
    npm start
fi

echo ""
echo "================================="
echo "✅ 配置完成！"
echo "================================="
echo ""
echo "📋 下一步："
echo "   1. 本地测试: npm start"
echo "   2. 部署到Vercel: vercel --prod"
echo "   3. 查看完整指南: cat deployment-guide.md"
echo ""
