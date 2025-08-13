// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import crypto from 'crypto';

// --- 类型定义 ---
interface EndpointData {
    t: string;
    r: string;
}

interface TokenInfo {
    endpoint: EndpointData | null;
    token: string | null;
    expiredAt: number | null;
}

interface SpeechRequestBody {
    input: string;
    voice?: string;
    speed?: string;
    pitch?: string;
    style?: string;
}


// --- 变量和常量 ---
const app = express();
const PORT: number = 3822;

const TOKEN_REFRESH_BEFORE_EXPIRY: number = 3 * 60;
let tokenInfo: TokenInfo = {
    endpoint: null,
    token: null,
    expiredAt: null,
};

// --- 中间件 ---
app.use(cors());
app.use(express.json());

async function base64ToBytes(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function dateFormat() {
    const formattedDate = (new Date()).toUTCString().replace(/GMT/, "").trim() + " GMT";
    return formattedDate.toLowerCase();
}

function uuid() {
    return crypto.randomUUID().replace(/-/g, "");
}

async function hmacSha256(key: BufferSource, data: string) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(signature);
}

async function bytesToBase64(bytes: any) {
    return btoa(String.fromCharCode.apply(null, bytes));
}


async function sign(urlStr: string) {
    const url = urlStr.split("://")[1];
    const encodedUrl = encodeURIComponent(url);
    const uuidStr = uuid();
    const formattedDate = dateFormat();
    const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();
    const decode = await base64ToBytes("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
    const signData = await hmacSha256(decode, bytesToSign);
    const signBase64 = await bytesToBase64(signData);
    return `MSTranslatorAndroidApp::${signBase64}::${formattedDate}::${uuidStr}`;
}

async function getEndpoint() {
    const now = Date.now() / 1000;

    if (tokenInfo.token && tokenInfo.expiredAt && now < tokenInfo.expiredAt - TOKEN_REFRESH_BEFORE_EXPIRY) {
        return tokenInfo.endpoint;
    }

    // 获取新token
    const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
    const clientId = crypto.randomUUID().replace(/-/g, "");

    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Accept-Language": "zh-Hans",
                "X-ClientVersion": "4.0.530a 5fe1dc6c",
                "X-UserId": "0f04d16a175c411e",
                "X-HomeGeographicRegion": "zh-Hans-CN",
                "X-ClientTraceId": clientId,
                "X-MT-Signature": await sign(endpointUrl),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": "0",
                "Accept-Encoding": "gzip"
            }
        });

        if (!response.ok) {
            throw new Error(`获取endpoint失败: ${response.status}`);
        }

        const data: any = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));

        tokenInfo = {
            endpoint: data,
            token: data.t,
            expiredAt: decodedJwt.exp
        };

        return data;

    } catch (error) {
        console.error("获取endpoint失败:", error);
        // 如果有缓存的token，即使过期也尝试使用
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}
// --- 核心函数 (与 JS 版本类似，但增加了类型) ---

function getSsml(text: string, voiceName: string, rate: string, pitch: string, volume: string, style: string, slien: number = 0): string {
    // ... (函数体与之前相同)
    let slien_str = slien > 0 ? `<break time="${slien}ms" />` : '';
    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"><voice name="${voiceName}"><mstts:express-as style="${style}" styledegree="2.0" role="default"><prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${text}</prosody></mstts:express-as>${slien_str}</voice></speak>`;
}

async function getAudioChunk(text: string, voiceName: string, rate: string, pitch: string, volume: string, style: string, outputFormat: string = 'audio-24khz-48kbitrate-mono-mp3'): Promise<Buffer> {
    const endpoint = await getEndpoint();
    const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;
    // ... (函数体与之前相同, response.buffer() 返回 Promise<Buffer>)
    let m = text.match(/\[(\d+)\]\s*?$/);
    let slien = 0;
    if (m && m.length == 2) {
        slien = parseInt(m[1]);
        text = text.replace(m[0], '');
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + endpoint.t,
            "Content-Type": "application/ssml+xml",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
            "X-Microsoft-OutputFormat": outputFormat
        },
        body: getSsml(text, voiceName, rate, pitch, volume, style, slien)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Edge TTS API error: ${response.status} ${errorText}`);
    }
    return response.buffer();
}


async function getVoice(text: string, voiceName: string, rate: string, pitch: string, volume: string, style: string, outputFormat: string): Promise<Buffer> {
    const chunks = text.trim().split("\n");
    const audioChunks: Buffer[] = [];
    for (const chunk of chunks) {
        const audio_chunk = await getAudioChunk(chunk, voiceName, rate, pitch, volume, style, outputFormat);
        audioChunks.push(audio_chunk);
    }
    return Buffer.concat(audioChunks);
}


// --- 身份验证函数 (与之前相同，TS 会自动推断大部分类型) ---

// atob 在 Node.js 中不存在，需要用 Buffer 实现
const atob = (b64: string): string => Buffer.from(b64, 'base64').toString('binary');
// ... 其他 sign, getEndpoint 等函数与之前 JS 版本基本一致 ...
// (为了简洁，这里省略，您可以直接复用上一版回答中的代码)


// --- Express 路由 ---
app.post('/v1/audio/speech', async (req: Request<{}, {}, SpeechRequestBody>, res: Response) => {
    try {
        const {
            input,
            voice = "zh-CN-XiaoxiaoNeural",
            speed = '1.0',
            pitch = '0',
            style = "general"
        } = req.body;

        if (!input) {
            return res.status(400).json({ error: { message: "Input text is required." } });
        }

        const rate = `${Math.round((parseFloat(speed) - 1.0) * 100)}%`;
        const finalPitch = `${parseInt(pitch) >= 0 ? '+' : ''}${parseInt(pitch)}Hz`;

        const audioBuffer = await getVoice(
            input,
            voice,
            rate,
            finalPitch,
            '+0%',
            style,
            "audio-24khz-48kbitrate-mono-mp3"
        );

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({
            error: {
                message: error.message,
                type: "api_error"
            }
        });
    }
});


// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`TTS后端服务已启动，监听端口 ${PORT}`);
});