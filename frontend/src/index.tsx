import { useState } from 'react';
import Logo from '@/assets/logo.svg?react'

function App() {
    const [text, setText] = useState<string>('');
    const [voice, setVoice] = useState<string>('zh-CN-XiaoxiaoNeural');
    const [speed, setSpeed] = useState<string>('1.0');
    const [pitch, setPitch] = useState<string>('0');
    const [voiceStyle, setVoiceStyle] = useState<string>('general');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }

        // const API_URL = '/v1/audio/speech';
        const API_URL = 'http://localhost:3822/v1/audio/speech';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: text, voice, speed: parseFloat(speed), pitch, style: voiceStyle })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || '生成失败');
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            setError(null);

        } catch (err: any) {
            setError('错误: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-900 text-slate-300 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-7xl mx-auto">
                <header className="flex flex-col items-center text-center mb-10">
                    <Logo className={'w-[80px]'} />
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        言之有声
                    </h1>
                    <p className="mt-3 text-lg text-slate-400">
                        让文字摆脱沉默的束缚
                    </p>
                </header>

                <main className="w-full">
                    <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <label htmlFor="text" className="block text-sm font-medium text-slate-400 mb-2">
                                    创作文本
                                </label>
                                <textarea
                                    id="text"
                                    className="w-full p-4 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out min-h-[260px] text-base bg-slate-900 text-slate-200 placeholder-slate-500"
                                    placeholder="在此输入或粘贴您的文本..."
                                    required
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </div>

                            {/* 右侧：参数配置区 */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="voice" className="block text-sm font-medium text-slate-400 mb-2">语音选择</label>
                                    <select id="voice" value={voice} onChange={e => setVoice(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">
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
                                <div>
                                    <label htmlFor="style" className="block text-sm font-medium text-slate-400 mb-2">语音风格</label>
                                    <select id="style" value={voiceStyle} onChange={e => setVoiceStyle(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">
                                        <option value="general">通用风格</option>
                                        <option value="assistant">智能助手</option>
                                        <option value="chat">聊天对话</option>
                                        <option value="customerservice">客服专业</option>
                                        <option value="newscast">新闻播报</option>
                                        <option value="affectionate">亲切温暖</option>
                                        <option value="calm">平静舒缓</option>
                                        <option value="cheerful">愉快欢乐</option>
                                        <option value="gentle">温和柔美</option>
                                        <option value="lyrical">抒情诗意</option>
                                        <option value="serious">严肃正式</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="speed" className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                        <span>语速调节</span>
                                        <span className="font-bold text-cyan-400">{parseFloat(speed).toFixed(1)}x</span>
                                    </label>
                                    <input id="speed" type="range" min="0.5" max="2.0" step="0.1" value={speed} onChange={e => setSpeed(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                </div>
                                <div>
                                    <label htmlFor="pitch" className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                        <span>音调高低</span>
                                        <span className="font-bold text-cyan-400">{parseInt(pitch) > 0 ? `+${pitch}` : pitch}</span>
                                    </label>
                                    <input id="pitch" type="range" min="-50" max="50" step="1" value={pitch} onChange={e => setPitch(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-cyan-500/20" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>生成中...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>生成声波</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {(audioUrl || error) && (
                            <div className="mt-8 pt-6 border-t border-slate-700">
                                {audioUrl && (
                                    <div className="space-y-4 bg-slate-900 p-4 rounded-lg">
                                        <audio src={audioUrl} className="w-full" controls>
                                            您的浏览器不支持音频播放。
                                        </audio>
                                        <a href={audioUrl} className="inline-block w-full text-center bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors" download="speech.mp3">
                                            下载音频文件
                                        </a>
                                    </div>
                                )}
                                {error && (
                                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex" role="alert">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div>
                                            <p className="font-bold text-red-200">发生错误</p>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
}

export default App;