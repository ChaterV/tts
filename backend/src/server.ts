// tts/backend/src/server.ts
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

// 对话行结构包含所有参数
interface DialogueLine {
    text: string;
    voice: string;
    role: string;
    style: string;
    speed: string; // 新增
    pitch: string; // 新增
    styleDegree: string; // 新增
}

// 请求体结构保持不变
interface SpeechRequestBody {
    input?: string;
    dialogue?: DialogueLine[];
    voice?: string;
    speed?: string;
    pitch?: string;
    style?: string;
    role?: string;
    styleDegree?: number;
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

const atob = (b64: string): string => Buffer.from(b64, 'base64').toString('binary');
const btoa = (str: string): string => Buffer.from(str, 'binary').toString('base64');


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
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}


/**
 * (普通模式) 根据参数生成单段文本的SSML
 */
function getSsml(text: string, voiceName: string, rate: string, pitch: string, volume: string, style: string, role: string, styleDegree: number): string {
    const roleAttribute = role ? ` role="${role}"` : '';
    const styleDegreeAttribute = styleDegree ? ` styledegree="${styleDegree}"` : '';
    const finalStyle = role ? 'general' : style;

    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"><voice name="${voiceName}"><mstts:express-as style="${finalStyle}"${roleAttribute}${styleDegreeAttribute}><prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${text}</prosody></mstts:express-as></voice></speak>`;
}

/**
 * (对话模式) 根据对话列表生成完整的SSML
 */
function getDialogueSsml(dialogue: DialogueLine[]): string {
    const body = dialogue.map(line => {
        if (!line.text.trim()) return '';

        // 为每一行独立计算参数
        const rate = `${Math.round((parseFloat(line.speed) - 1.0) * 100)}%`;
        const finalPitch = `${parseInt(line.pitch) >= 0 ? '+' : ''}${parseInt(line.pitch)}Hz`;
        const styleDegree = parseFloat(line.styleDegree);

        const roleAttribute = line.role ? ` role="${line.role}"` : '';
        const styleDegreeAttribute = styleDegree ? ` styledegree="${styleDegree}"` : '';
        const finalStyle = line.role ? 'general' : (line.style || 'general');

        const sanitizedText = `<![CDATA[${line.text}]]>`;

        // 将 prosody 标签包裹在 express-as 内部
        return `<voice name="${line.voice}">
                    <mstts:express-as style="${finalStyle}"${roleAttribute}${styleDegreeAttribute}>
                        <prosody rate="${rate}" pitch="${finalPitch}" volume="+0%">
                            ${sanitizedText}
                        </prosody>
                    </mstts:express-as>
                </voice>`;
    }).join('\n');

    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN">${body}</speak>`;
}


/**
 * 请求微软API，直接从SSML合成音频
 */
async function getAudioFromSsml(ssml: string, outputFormat: string = 'audio-24khz-48kbitrate-mono-mp3'): Promise<Buffer> {
    const endpoint = await getEndpoint();
    if (!endpoint) {
        throw new Error("无法获取有效的 endpoint。");
    }
    const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + endpoint.t,
            "Content-Type": "application/ssml+xml",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
            "X-Microsoft-OutputFormat": outputFormat
        },
        body: ssml
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Edge TTS API error: ${response.status} - ${errorText}`);
    }
    return response.buffer();
}


// --- Express 路由 ---
app.post('/v1/audio/speech', async (req: Request<{}, {}, SpeechRequestBody>, res: Response) => {
    try {
        const {
            input,
            dialogue,
            voice = "zh-CN-XiaoxiaoNeural",
            speed = '1.0',
            pitch = '0',
            style = "general",
            role = "",
            styleDegree = 1,
        } = req.body;

        let audioBuffer: Buffer;

        // 优先处理对话模式
        if (dialogue && dialogue.length > 0) {
            console.log("进入对话模式合成...");
            const ssml = getDialogueSsml(dialogue);
            audioBuffer = await getAudioFromSsml(ssml);

            // 处理单文本输入模式
        } else if (input) {
            const trimmedInput = input.trim();
            if (trimmedInput.startsWith('<speak') && trimmedInput.endsWith('</speak>')) {
                console.log("检测到 SSML 输入，进入高级模式。");
                audioBuffer = await getAudioFromSsml(trimmedInput);
            } else {
                console.log("进入普通模式合成...");
                const rate = `${Math.round((parseFloat(speed) - 1.0) * 100)}%`;
                const finalPitch = `${parseInt(pitch) >= 0 ? '+' : ''}${parseInt(pitch)}Hz`;
                const ssml = getSsml(input, voice, rate, finalPitch, '+0%', style, role, styleDegree);
                audioBuffer = await getAudioFromSsml(ssml);
            }
        } else {
            return res.status(400).json({ error: { message: "Input or dialogue is required." } });
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);

    } catch (error: any) {
        console.error("合成错误:", error);
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