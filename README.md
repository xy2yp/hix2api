# HIX.AI API Proxy

这是一个基于Cloudflare Worker的HIX.AI API代理服务，它将HIX.AI的API转换为OpenAI兼容的API格式。
请在部署前修改wrangler.toml中的API密钥为你自己所需的密钥。

## 部署说明

1. 安装依赖
```bash
npm install -g wrangler
```

2. 配置项目
```bash
wrangler login
```

3. 部署到Cloudflare Workers
```bash
wrangler deploy
```

## 使用方法

1. 获取可用模型列表：
```bash
curl https://your-worker.workers.dev/v1/models \
  -H "Authorization: Bearer your-api-key"
```

2. 发送对话请求：
```bash
curl https://your-worker.workers.dev/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "model-name",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```
