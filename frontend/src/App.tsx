import { useState } from 'react';
import './App.css';

function App() {
    // 使用泛型为 state 添加类型
    const [text, setText] = useState<string>('');
    const [voice, setVoice] = useState<string>('zh-CN-XiaoxiaoNeural');
    const [speed, setSpeed] = useState<string>('1.0');
    const [pitch, setPitch] = useState<string>('0');
    const [voiceStyle, setvoiceStyle] = useState<string>('general');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [generateSuccess, setGenerateSuccess] = useState<boolean>(false)

    // 为事件处理函数添加类型
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // 如果之前有音频，先释放掉，避免内存泄漏
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }

        const API_URL = '/v1/audio/speech';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: text, voice, speed: parseFloat(speed), pitch, voiceStyle })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || '生成失败');
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            setGenerateSuccess(true)
            setError(null)

        } catch (err: any) {
            setError('错误: ' + err.message);
            setGenerateSuccess(false)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>声音魔法师</h1>
                <p className="subtitle">让文字开口说话的神器</p>
                <div className="features">
                    <div className="feature-item">
                        <span className="feature-icon">✨</span>
                        <span>20+种中文声音</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span>秒速生成</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🆓</span>
                        <span>完全免费</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📱</span>
                        <span>支持下载</span>
                    </div>
                </div>
            </div>
            <div className='main-content'>
                <div className='form-container'>
                    <form id="ttsForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="text">输入文本</label>
                            <textarea
                                className="form-textarea" id="text"
                                placeholder="请输入要转换为语音的文本内容，支持中文、英文、数字等..."
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="controls-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="voice">语音选择</label>
                                <select className="form-select" id="voice" value={voice}
                                        onChange={e => setVoice(e.target.value)}>
                                    <option value="zh-CN-XiaoxiaoNeural">晓晓 (女声·温柔)</option>
                                    <option value="zh-CN-YunxiNeural">云希 (男声·清朗)</option>
                                    <option value="zh-CN-YunyangNeural">云扬 (男声·阳光)</option>
                                    <option value="zh-CN-XiaoyiNeural">晓伊 (女声·甜美)</option>
                                    <option value="zh-CN-YunjianNeural">云健 (男声·稳重)</option>
                                    <option value="zh-CN-XiaochenNeural">晓辰 (女声·知性)</option>
                                    <option value="zh-CN-XiaohanNeural">晓涵 (女声·优雅)</option>
                                    <option value="zh-CN-XiaomengNeural">晓梦 (女声·梦幻)</option>
                                    <option value="zh-CN-XiaomoNeural">晓墨 (女声·文艺)</option>
                                    <option value="zh-CN-XiaoqiuNeural">晓秋 (女声·成熟)</option>
                                    <option value="zh-CN-XiaoruiNeural">晓睿 (女声·智慧)</option>
                                    <option value="zh-CN-XiaoshuangNeural">晓双 (女声·活泼)</option>
                                    <option value="zh-CN-XiaoxuanNeural">晓萱 (女声·清新)</option>
                                    <option value="zh-CN-XiaoyanNeural">晓颜 (女声·柔美)</option>
                                    <option value="zh-CN-XiaoyouNeural">晓悠 (女声·悠扬)</option>
                                    <option value="zh-CN-XiaozhenNeural">晓甄 (女声·端庄)</option>
                                    <option value="zh-CN-YunfengNeural">云枫 (男声·磁性)</option>
                                    <option value="zh-CN-YunhaoNeural">云皓 (男声·豪迈)</option>
                                    <option value="zh-CN-YunxiaNeural">云夏 (男声·热情)</option>
                                    <option value="zh-CN-YunyeNeural">云野 (男声·野性)</option>
                                    <option value="zh-CN-YunzeNeural">云泽 (男声·深沉)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="speed">语速调节</label>
                                <select className="form-select" id="speed" value={speed}
                                        onChange={e => setSpeed(e.target.value)}>
                                    <option value="0.5">🐌 很慢</option>
                                    <option value="0.75">🚶 慢速</option>
                                    <option value="1.0" selected>⚡ 正常</option>
                                    <option value="1.25">🏃 快速</option>
                                    <option value="1.5">🚀 很快</option>
                                    <option value="2.0">💨 极速</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="pitch">音调高低</label>
                                <select className="form-select" id="pitch" value={pitch}
                                        onChange={e => setPitch(e.target.value)}>
                                    <option value="-50">📉 很低沉</option>
                                    <option value="-25">📊 低沉</option>
                                    <option value="0" selected>🎵 标准</option>
                                    <option value="25">📈 高亢</option>
                                    <option value="50">🎶 很高亢</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="style">语音风格</label>
                                <select className="form-select" id="style" value={voiceStyle}
                                        onChange={e => setvoiceStyle(e.target.value)}>
                                    <option value="general" selected>🎭 通用风格</option>
                                    <option value="assistant">🤖 智能助手</option>
                                    <option value="chat">💬 聊天对话</option>
                                    <option value="customerservice">📞 客服专业</option>
                                    <option value="newscast">📺 新闻播报</option>
                                    <option value="affectionate">💕 亲切温暖</option>
                                    <option value="calm">😌 平静舒缓</option>
                                    <option value="cheerful">😊 愉快欢乐</option>
                                    <option value="gentle">🌸 温和柔美</option>
                                    <option value="lyrical">🎼 抒情诗意</option>
                                    <option value="serious">🎯 严肃正式</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            <span>🎙️</span>
                            <span>{isLoading ? '生成中...' : '开始生成语音'}</span>
                        </button>
                    </form>

                    {
                        (generateSuccess || error) &&
                        <div className="result-container">
                            {
                                generateSuccess &&
                                <div>
                                    <audio src={audioUrl || ''} className="audio-player" controls></audio>
                                    <a href={audioUrl || ''} className="btn-secondary" download="speech.mp3">
                                        <span>📥</span>
                                        <span>下载音频文件</span>
                                    </a>
                                </div>
                            }


                            {
                                error &&
                                <div className="error-message">{error}</div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;