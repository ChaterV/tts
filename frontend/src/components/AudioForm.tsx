import React from 'react';

interface AudioFormProps {
    text: string;
    setText: (text: string) => void;
    voice: string;
    setVoice: (voice: string) => void;
    speed: string;
    setSpeed: (speed: string) => void;
    pitch: string;
    setPitch: (pitch: string) => void;
    voiceStyle: string;
    setVoiceStyle: (voiceStyle: string) => void;
    isLoading: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const voiceOptions = [
    { value: "zh-CN-XiaoxiaoNeural", label: "晓晓 (女声·温柔)" },
    { value: "zh-CN-YunxiNeural", label: "云希 (男声·清朗)" },
    { value: "zh-CN-YunyangNeural", label: "云扬 (男声·阳光)" },
    { value: "zh-CN-XiaoyiNeural", label: "晓伊 (女声·甜美)" },
    { value: "zh-CN-YunjianNeural", label: "云健 (男声·稳重)" },
    { value: "zh-CN-XiaochenNeural", label: "晓辰 (女声·知性)" },
    { value: "zh-CN-XiaohanNeural", label: "晓涵 (女声·优雅)" },
    { value: "zh-CN-XiaomengNeural", label: "晓梦 (女声·梦幻)" },
    { value: "zh-CN-XiaomoNeural", label: "晓墨 (女声·文艺)" },
    { value: "zh-CN-XiaoqiuNeural", label: "晓秋 (女声·成熟)" },
    { value: "zh-CN-XiaoruiNeural", label: "晓睿 (女声·智慧)" },
    { value: "zh-CN-XiaoshuangNeural", label: "晓双 (女声·活泼)" },
    { value: "zh-CN-XiaoxuanNeural", label: "晓萱 (女声·清新)" },
    { value: "zh-CN-XiaoyanNeural", label: "晓颜 (女声·柔美)" },
    { value: "zh-CN-XiaoyouNeural", label: "晓悠 (女声·悠扬)" },
    { value: "zh-CN-XiaozhenNeural", label: "晓甄 (女声·端庄)" },
    { value: "zh-CN-YunfengNeural", label: "云枫 (男声·磁性)" },
    { value: "zh-CN-YunhaoNeural", label: "云皓 (男声·豪迈)" },
    { value: "zh-CN-YunxiaNeural", label: "云夏 (男声·热情)" },
    { value: "zh-CN-YunyeNeural", label: "云野 (男声·野性)" },
    { value: "zh-CN-YunzeNeural", label: "云泽 (男声·深沉)" },
];

const voiceStyleOptions = [
    { value: "general", label: "通用风格" },
    { value: "assistant", label: "智能助手" },
    { value: "chat", label: "聊天对话" },
    { value: "customerservice", label: "客服专业" },
    { value: "newscast", label: "新闻播报" },
    { value: "affectionate", label: "亲切温暖" },
    { value: "calm", label: "平静舒缓" },
    { value: "cheerful", label: "愉快欢乐" },
    { value: "gentle", label: "温和柔美" },
    { value: "lyrical", label: "抒情诗意" },
    { value: "serious", label: "严肃正式" },
];

const AudioForm: React.FC<AudioFormProps> = ({
    text,
    setText,
    voice,
    setVoice,
    speed,
    setSpeed,
    pitch,
    setPitch,
    voiceStyle,
    setVoiceStyle,
    isLoading,
    handleSubmit,
}) => {
    return (
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

                <div className="space-y-6">
                    <div>
                        <label htmlFor="voice" className="block text-sm font-medium text-slate-400 mb-2">语音选择</label>
                        <select id="voice" value={voice} onChange={e => setVoice(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">
                            {voiceOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-slate-400 mb-2">语音风格</label>
                        <select id="style" value={voiceStyle} onChange={e => setVoiceStyle(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">
                            {voiceStyleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
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
                        <span>生成声波</span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AudioForm;