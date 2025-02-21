// pipe.js
const API_KEY = 'Bearer sk-phantasia';
const CHAT_ID_REGEX = /Chat ID:\s*([a-zA-Z0-9_-]+)/;

const SUB_PIPES = [
  // DeepSeek Models
  {"id": "85426", "bot_id": 85426, "name": "DeepSeek-R1", "capabilities": { "chain_of_thought": true }},
  {"id": "85427", "bot_id": 85427, "name": "DeepSeek-V3", "capabilities": { "chain_of_thought": false }},
  
  // Claude Models
  {"id": "85422", "bot_id": 85422, "name": "Claude 3.5 Haiku", "capabilities": { "chain_of_thought": false }},
  {"id": "42", "bot_id": 42, "name": "Claude", "capabilities": { "chain_of_thought": false }},
  {"id": "50", "bot_id": 50, "name": "Claude 3.5 Sonnet v2", "capabilities": { "chain_of_thought": false }},
  {"id": "52", "bot_id": 52, "name": "Claude 3 Haiku", "capabilities": { "chain_of_thought": false }},
  {"id": "53", "bot_id": 53, "name": "Claude 3 Opus", "capabilities": { "chain_of_thought": false }},
  {"id": "85423", "bot_id": 85423, "name": "Claude 3.5 Haiku 200K", "capabilities": { "chain_of_thought": false }},
  {"id": "54", "bot_id": 54, "name": "Claude 3.5 Sonnet v2 200K", "capabilities": { "chain_of_thought": false }},
  {"id": "55", "bot_id": 55, "name": "Claude 3 Sonnet 200K", "capabilities": { "chain_of_thought": false }},
  {"id": "56", "bot_id": 56, "name": "Claude 3 Haiku 200K", "capabilities": { "chain_of_thought": false }},
  {"id": "57", "bot_id": 57, "name": "Claude 3 Opus 200K", "capabilities": { "chain_of_thought": false }},
  {"id": "44", "bot_id": 44, "name": "Claude Instant 100K", "capabilities": { "chain_of_thought": false }},
  {"id": "45", "bot_id": 45, "name": "Claude 2", "capabilities": { "chain_of_thought": false }},
  {"id": "47", "bot_id": 47, "name": "Claude 2 100K", "capabilities": { "chain_of_thought": false }},
  {"id": "49", "bot_id": 49, "name": "Claude 2.1 200K", "capabilities": { "chain_of_thought": false }},
  {"id": "51", "bot_id": 51, "name": "Claude 3 Sonnet", "capabilities": { "chain_of_thought": false }},

  // OpenAI Models
  {"id": "1181", "bot_id": 1181, "name": "OpenAI o1", "capabilities": { "chain_of_thought": false }},
  {"id": "85424", "bot_id": 85424, "name": "OpenAI o3-mini", "capabilities": { "chain_of_thought": false }},
  {"id": "1182", "bot_id": 1182, "name": "OpenAI o1-mini", "capabilities": { "chain_of_thought": false }},
  {"id": "5", "bot_id": 5, "name": "GPT-4o", "capabilities": { "chain_of_thought": false }},
  {"id": "6", "bot_id": 6, "name": "GPT-4o 128K", "capabilities": { "chain_of_thought": false }},
  {"id": "86", "bot_id": 86, "name": "GPT-4o mini", "capabilities": { "chain_of_thought": false }},
  {"id": "8", "bot_id": 8, "name": "GPT-4 Turbo", "capabilities": { "chain_of_thought": false }},
  {"id": "9", "bot_id": 9, "name": "GPT-4 Turbo 128K", "capabilities": { "chain_of_thought": false }},
  {"id": "10", "bot_id": 10, "name": "GPT-4", "capabilities": { "chain_of_thought": false }},
  {"id": "2", "bot_id": 2, "name": "ChatGPT", "capabilities": { "chain_of_thought": false }},
  {"id": "3", "bot_id": 3, "name": "GPT-3.5 Turbo", "capabilities": { "chain_of_thought": false }},
  {"id": "4", "bot_id": 4, "name": "GPT-3.5 Turbo 16K", "capabilities": { "chain_of_thought": false }},

  // Gemini Models
  {"id": "59", "bot_id": 59, "name": "Gemini 1.5 Flash", "capabilities": { "chain_of_thought": false }},
  {"id": "60", "bot_id": 60, "name": "Gemini 1.5 Pro", "capabilities": { "chain_of_thought": false }},
  {"id": "62", "bot_id": 62, "name": "Gemini 1.5 Flash 128K", "capabilities": { "chain_of_thought": false }},
  {"id": "63", "bot_id": 63, "name": "Gemini 1.5 Pro 128K", "capabilities": { "chain_of_thought": false }},
  {"id": "65", "bot_id": 65, "name": "Gemini 1.5 Flash 1M", "capabilities": { "chain_of_thought": false }},
  {"id": "67", "bot_id": 67, "name": "Gemini 1.5 Pro 1M", "capabilities": { "chain_of_thought": false }},
  {"id": "83", "bot_id": 83, "name": "Gemini", "capabilities": { "chain_of_thought": false }},
  {"id": "58", "bot_id": 58, "name": "Gemini 1.0 Pro", "capabilities": { "chain_of_thought": false }},

  // Grok Models
  {"id": "85428", "bot_id": 85428, "name": "Grok-2", "capabilities": { "chain_of_thought": false }},
];


function formatMessages(messages) {
  let systemMessages = messages
    .filter(msg => msg.role === 'system')
    .map(msg => `system：${msg.content}`)
  
  let otherMessages = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => `${msg.role}：${msg.content}`)
  
  return [...systemMessages, ...otherMessages].join('\n\n ')
}

class Pipe {
  constructor() {
    this.API_DOMAIN = "https://hix.ai";
    this.f = "nvKTEonFAll-in-One AI Writing CopilotwNLf2plwvtlcCxam";
    this.salt = "xJ7fTJBgQ55/9r|";
    this.ssePrefix = "data: ";
    
    // Session properties
    this.deviceId = null;
    this.deviceNumber = null;
    this.csrfToken = null;
    this.cookieJar = {};
    this.loggedIn = false;
  }

  pipes() {
    return SUB_PIPES.map(sp => ({
      id: sp.id,
      name: `${sp.name} (botId=${sp.id})`
    }));
  }

  async genDeviceInfo() {
    const deviceIdUUID = crypto.randomUUID();
    const encoder = new TextEncoder();
    
    const deviceIdBuffer = await crypto.subtle.digest("MD5", encoder.encode(deviceIdUUID));
    const deviceId = Array.from(new Uint8Array(deviceIdBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const fMd5Buffer = await crypto.subtle.digest("MD5", encoder.encode(this.f));
    const fMd5 = Array.from(new Uint8Array(fMd5Buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const e = fMd5 + deviceId + this.salt;
    const deviceNumberBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(e));
    const deviceNumber = Array.from(new Uint8Array(deviceNumberBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return { deviceId, deviceNumber };
  }

  async customFetch(url, options = {}) {
    const headers = {
      ...options.headers,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Cookie': Object.entries(this.cookieJar)
        .map(([k, v]) => `${k}=${v}`).join('; ')
    };

    const response = await fetch(url, { ...options, headers });
    
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      setCookie.split(',').forEach(cookie => {
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        this.cookieJar[name.trim()] = value;
      });
    }

    return response;
  }

  generateRandomTitle() {
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `Chat - ${now}`;
  }

  async getCsrfToken() {
    const response = await this.customFetch(`${this.API_DOMAIN}/api/auth/csrf`);
    const data = await response.json();
    return data.csrfToken;
  }

  async anonymousLogin() {
    const formData = new URLSearchParams({
      redirect: 'false',
      version: 'v1',
      deviceId: this.deviceId,
      deviceNumber: this.deviceNumber,
      csrfToken: this.csrfToken,
      callbackUrl: 'https://hix.ai',
      json: 'true'
    });

    await this.customFetch(`${this.API_DOMAIN}/api/auth/callback/anonymous-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://hix.ai/'
      },
      body: formData
    });
  }

  async createChat(botId) {
    const response = await this.customFetch(
      `${this.API_DOMAIN}/api/trpc/hixChat.createChat?batch=1`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "0": {
            json: {
              title: `${this.generateRandomTitle()} for hixAI TestTeam.`,
              botId
            }
          }
        })
      }
    );
    const data = await response.json();
    return data[0].result.data.json.id;
  }

  async *chatStream(chatId, question) {
    const response = await this.customFetch(`${this.API_DOMAIN}/api/hix/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId,
        question,
        fileUrl: ""
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isThinking = false;
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // 处理完整的消息
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (!line.trim()) continue;

        try {
          // 处理事件行
          if (line.startsWith('event:')) {
            continue;
          }

          // 处理数据行
          if (line.startsWith('data:')) {
            const data = JSON.parse(line.slice(5));
            
            // 处理思考内容
            if (data.reasoning_content) {
              if (!isThinking) {
                isThinking = true;
                // 发送思考开始标记
                const thinkStartChunk = {
                  id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: "deepseek-r1",
                  choices: [{
                    index: 0,
                    delta: {
                      content: "\n<think>\n"
                    },
                    logprobs: null,
                    finish_reason: null
                  }]
                };
                yield `data: ${JSON.stringify(thinkStartChunk)}\n\n`;
              }
              
              // 逐字符发送思考内容
              const content = data.reasoning_content;
              for (let i = 0; i < content.length; i++) {
                const chunk = {
                  id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: "deepseek-r1",
                  choices: [{
                    index: 0,
                    delta: {
                      content: content[i]
                    },
                    logprobs: null,
                    finish_reason: null
                  }]
                };
                yield `data: ${JSON.stringify(chunk)}\n\n`;
              }
            }
            // 处理普通内容
            else if (data.content) {
              if (isThinking) {
                // 发送思考结束标记
                const thinkEndChunk = {
                  id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: "deepseek-r1",
                  choices: [{
                    index: 0,
                    delta: {
                      content: "\n</think>\n\n"
                    },
                    logprobs: null,
                    finish_reason: null
                  }]
                };
                yield `data: ${JSON.stringify(thinkEndChunk)}\n\n`;
                isThinking = false;
              }

              // 逐字符发送普通内容
              const content = data.content;
              for (let i = 0; i < content.length; i++) {
                const chunk = {
                  id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: "deepseek-r1",
                  choices: [{
                    index: 0,
                    delta: {
                      content: content[i]
                    },
                    logprobs: null,
                    finish_reason: null
                  }]
                };
                yield `data: ${JSON.stringify(chunk)}\n\n`;
              }
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // 如果还在思考状态，发送结束标记
    if (isThinking) {
      const closeThinkChunk = {
        id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: "deepseek-r1",
        choices: [{
          index: 0,
          delta: {
            content: "\n</think>\n\n"
          },
          logprobs: null,
          finish_reason: null
        }]
      };
      yield `data: ${JSON.stringify(closeThinkChunk)}\n\n`;
    }

    // 发送结束消息
    const finalChunk = {
      id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
      object: "chat.completion.chunk",
      created: Math.floor(Date.now() / 1000),
      model: "deepseek-r1",
      choices: [{
        index: 0,
        delta: {},
        logprobs: null,
        finish_reason: "stop"
      }]
    };
    yield `data: ${JSON.stringify(finalChunk)}\n\n`;
    yield 'data: [DONE]\n\n';
  }

  async init() {
    if (!this.deviceId || !this.deviceNumber) {
      const deviceInfo = await this.genDeviceInfo();
      this.deviceId = deviceInfo.deviceId;
      this.deviceNumber = deviceInfo.deviceNumber;
    }

    if (!this.loggedIn) {
      this.csrfToken = await this.getCsrfToken();
      await this.anonymousLogin();
      this.loggedIn = true;
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add models endpoint check
    if (url.pathname === '/v1/models' && request.method === 'GET') {
      // Verify Authorization header
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader !== API_KEY) {
        return new Response(JSON.stringify({
          error: {
            message: "Invalid API key provided",
            type: "invalid_request_error",
            code: "invalid_api_key"
          }
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const models = SUB_PIPES.map(pipe => ({
        "id": pipe.name.toLowerCase().replace(/ /g, '-'),
        "object": "model",
        "created": 1626777600,
        "owned_by": pipe.name.split(' ')[0],
        "permission": null,
        "root": pipe.name.toLowerCase().replace(/ /g, '-'),
        "parent": null
      }));

      return new Response(JSON.stringify({
        "data": models
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!url.pathname.includes('/v1/chat/completions')) {
      return new Response('Not Found', { status: 404 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // 验证 Authorization 头
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader !== API_KEY) {
      return new Response(JSON.stringify({
        error: {
          message: "Invalid API key provided",
          type: "invalid_request_error",
          code: "invalid_api_key"
        }
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      
      // 验证模型是否支持
      const requestedModel = body.model?.toLowerCase();
      const selectedPipe = SUB_PIPES.find(pipe => 
        pipe.name.toLowerCase().replace(/ /g, '-') === requestedModel
      );

      if (!selectedPipe) {
        return new Response(JSON.stringify({
          error: {
            message: "Model not supported. Please check available models.",
            type: "invalid_request_error",
            code: "model_not_supported"
          }
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const pipe = new Pipe();
      await pipe.init();
      
      let chatId = null;
      let question = '';
      const subId = selectedPipe.id;
      const botId = selectedPipe.bot_id;

      if (body.messages?.length) {
        for (const msg of body.messages) {
          if (msg.role === 'assistant') {
            const match = CHAT_ID_REGEX.exec(msg.content || '');
            if (match) chatId = match[1];
          }
        }
        question = formatMessages(body.messages);
      }

      if (!question) {
        return new Response(
          JSON.stringify({ error: 'No user question found' }),
          { headers: { 'Content-Type': 'application/json' }}
        );
      }

      // 检查是否为流式请求
      const isStream = body.stream === true;

      if (isStream) {
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();

        ctx.waitUntil((async () => {
          try {
            if (!chatId) {
              chatId = await pipe.createChat(botId);
            }

            for await (const token of pipe.chatStream(chatId, question)) {
              await writer.write(encoder.encode(token));
            }
          } catch (error) {
            await writer.write(
              encoder.encode(JSON.stringify({ error: error.message }))
            );
          } finally {
            await writer.close();
          }
        })());

        return new Response(stream.readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } else {
        // 非流式请求处理
        try {
          if (!chatId) {
            chatId = await pipe.createChat(botId);
          }

          let fullContent = '';
          let isThinking = false;
          let thinkContent = '';

          // 收集完整响应
          for await (const chunk of pipe.chatStream(chatId, question)) {
            if (!chunk.startsWith('data: ')) continue;
            if (chunk === 'data: [DONE]\n\n') continue;

            const data = JSON.parse(chunk.slice(5));
            if (!data.choices?.[0]?.delta?.content) continue;

            const content = data.choices[0].delta.content;
            
            if (content.includes('<think>')) {
              isThinking = true;
              continue;
            }
            if (content.includes('</think>')) {
              if (thinkContent) {
                fullContent += '\n<think>\n' + thinkContent + '\n</think>\n\n';
                thinkContent = '';
              }
              isThinking = false;
              continue;
            }

            if (isThinking) {
              thinkContent += content;
            } else {
              fullContent += content;
            }
          }

          // 如果还有未处理的思考内容
          if (thinkContent) {
            fullContent += '\n<think>\n' + thinkContent + '\n</think>\n\n';
          }

          // 返回完整的非流式响应
          return new Response(JSON.stringify({
            id: `chatcmpl-${Math.random().toString(36).substr(2, 10)}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: "deepseek-r1",
            choices: [{
              index: 0,
              message: {
                role: "assistant",
                content: fullContent
              },
              finish_reason: "stop"
            }],
            usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};