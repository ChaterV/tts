import React, { useState } from 'react';
import type { DialogueLine } from '../hooks/useAudioGenerator';

interface AudioFormProps {
    isDialogueMode: boolean;
    setIsDialogueMode: (isDialogueMode: boolean) => void;
    dialogue: DialogueLine[];
    setDialogue: (dialogue: DialogueLine[]) => void;
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
    role: string;
    setRole: (role: string) => void;
    styleDegree: string;
    setStyleDegree: (styleDegree: string) => void;
    isLoading: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// 子组件：对话卡片
const DialogueCard = ({ line, index, onUpdate, onRemove, isLast }: { line: DialogueLine, index: number, onUpdate: Function, onRemove: Function, isLast: boolean }) => {
    const [isAdvancedOpen, setAdvancedOpen] = useState(false);
    return (
        <div className="bg-slate-900/50 rounded-lg border border-slate-700 transition-shadow hover:shadow-cyan-500/10">
            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-start">
                {/* 序号 */}
                <div className="hidden md:flex md:col-span-1 items-center justify-center h-full">
                    <span className="text-slate-500 font-bold text-lg">{index + 1}</span>
                </div>
                {/* 文本域 */}
                <div className="md:col-span-11 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <textarea
                        className="w-full p-3 border border-slate-600 rounded-lg min-h-[80px] bg-slate-800 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:col-span-2"
                        placeholder={`请输入第 ${index + 1} 句对话...`}
                        value={line.text}
                        onChange={(e) => onUpdate(line.id, 'text', e.target.value)}
                    />
                    {/* 基础设置 */}
                    <select value={line.voice} onChange={(e) => onUpdate(line.id, 'voice', e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                        {voiceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select value={line.role} onChange={(e) => onUpdate(line.id, 'role', e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                        {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select value={line.style} onChange={(e) => onUpdate(line.id, 'style', e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white sm:col-span-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                        {voiceStyleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </div>
            {/* 高级设置折叠面板 */}
            {isAdvancedOpen && (
                <div className="px-4 pb-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 border-t border-slate-800 pt-4">
                    <div>
                        <label className="flex justify-between text-sm font-medium text-slate-400 mb-2"><span>语速调节</span><span className="font-bold text-cyan-400">{parseFloat(line.speed).toFixed(1)}x</span></label>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={line.speed} onChange={(e) => onUpdate(line.id, 'speed', e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                    </div>
                    <div>
                        <label className="flex justify-between text-sm font-medium text-slate-400 mb-2"><span>音调高低</span><span className="font-bold text-cyan-400">{parseInt(line.pitch) > 0 ? `+${line.pitch}` : line.pitch}</span></label>
                        <input type="range" min="-50" max="50" step="1" value={line.pitch} onChange={(e) => onUpdate(line.id, 'pitch', e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                    </div>
                    <div>
                        <label className="flex justify-between text-sm font-medium text-slate-400 mb-2"><span>情感强度</span><span className="font-bold text-cyan-400">{parseFloat(line.styleDegree).toFixed(2)}</span></label>
                        <input type="range" min="0.01" max="2.0" step="0.01" value={line.styleDegree} onChange={(e) => onUpdate(line.id, 'styleDegree', e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                    </div>
                </div>
            )}
            {/* 操作栏 */}
            <div className="flex justify-between items-center bg-slate-900/80 px-4 py-2 rounded-b-lg">
                <button type="button" onClick={() => setAdvancedOpen(!isAdvancedOpen)} className="text-sm text-cyan-400 hover:text-cyan-300">
                    {isAdvancedOpen ? '收起高级设置' : '高级设置...'}
                </button>
                <button type="button" onClick={() => onRemove(line.id)} className="text-slate-500 hover:text-red-500 disabled:hover:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={isLast}>
                    删除
                </button>
            </div>
        </div>
    );
}

// 主表单组件
const AudioForm: React.FC<AudioFormProps> = ({ isDialogueMode, setIsDialogueMode, dialogue, setDialogue, text, setText, voice, setVoice, speed, setSpeed, pitch, setPitch, voiceStyle, setVoiceStyle, role, setRole, styleDegree, setStyleDegree, isLoading, handleSubmit }) => {

    const handleDialogueChange = (id: number, field: keyof Omit<DialogueLine, 'id'>, value: string) => {
        const newDialogue = dialogue.map(line => line.id === id ? { ...line, [field]: value } : line);
        setDialogue(newDialogue);
    };

    const addDialogueLine = () => {
        setDialogue([...dialogue, { id: Date.now(), text: '', voice: 'zh-CN-XiaoxiaoNeural', role: '', style: 'general', speed: '1.0', pitch: '0', styleDegree: '1.0' }]);
    };

    const removeDialogueLine = (id: number) => {
        if (dialogue.length > 1) setDialogue(dialogue.filter(line => line.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex justify-end mb-6">
                <label htmlFor="dialogue-toggle" className="flex items-center cursor-pointer">
                    <span className="mr-3 text-slate-400 font-medium">对话模式</span>
                    <div className="relative">
                        <input type="checkbox" id="dialogue-toggle" className="sr-only" checked={isDialogueMode} onChange={() => setIsDialogueMode(!isDialogueMode)} />
                        <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isDialogueMode ? 'transform translate-x-6 bg-cyan-400' : ''}`}></div>
                    </div>
                </label>
            </div>

            {isDialogueMode ? (
                // 对话模式UI
                <div className="space-y-5">
                    {dialogue.map((line, index) => (
                        <DialogueCard key={line.id} line={line} index={index} onUpdate={handleDialogueChange} onRemove={removeDialogueLine} isLast={dialogue.length <= 1} />
                    ))}
                    <button type="button" onClick={addDialogueLine} className="w-full border-2 border-dashed border-slate-600 text-slate-400 py-3 rounded-lg hover:bg-slate-700 hover:text-white transition font-bold">
                        + 添加一行对话
                    </button>
                </div>
            ) : (
                // 单文本模式UI
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <label htmlFor="text" className="block text-sm font-medium text-slate-400 mb-2">创作文本</label>
                        <textarea id="text" className="w-full p-4 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out min-h-[360px] text-base bg-slate-900 text-slate-200 placeholder-slate-500" placeholder="在此输入或粘贴您的文本..." required value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="voice" className="block text-sm font-medium text-slate-400 mb-2">语音选择</label>
                            <select id="voice" value={voice} onChange={e => setVoice(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">{voiceOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-400 mb-2">角色扮演</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">{roleOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="style" className="block text-sm font-medium text-slate-400 mb-2">语音风格</label>
                            <select id="style" value={voiceStyle} onChange={e => setVoiceStyle(e.target.value)} className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-slate-700 text-white">{voiceStyleOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="styleDegree" className="flex justify-between text-sm font-medium text-slate-400 mb-2"><span>情感强度</span><span className="font-bold text-cyan-400">{parseFloat(styleDegree).toFixed(2)}</span></label>
                            <input id="styleDegree" type="range" min="0.01" max="2.0" step="0.01" value={styleDegree} onChange={e => setStyleDegree(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                        <div>
                            <label htmlFor="speed" className="flex justify-between text-sm font-medium text-slate-400 mb-2"><span>语速调节</span><span className="font-bold text-cyan-400">{parseFloat(speed).toFixed(1)}x</span></label>
                            <input id="speed" type="range" min="0.5" max="2.0" step="0.1" value={speed} onChange={e => setSpeed(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                        <div>
                            <label htmlFor="pitch" className="flex justify-between text-sm font-medium text-slate-400 mb-2"><span>音调高低</span><span className="font-bold text-cyan-400">{parseInt(pitch) > 0 ? `+${pitch}` : pitch}</span></label>
                            <input id="pitch" type="range" min="-50" max="50" step="1" value={pitch} onChange={e => setPitch(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-8 pt-6 border-t border-slate-700">
                <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-cyan-500/20" disabled={isLoading}>
                    {isLoading ? ( <> <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> <span>生成中...</span> </> ) : ( <span>生成声波</span> )}
                </button>
            </div>
        </form>
    );
};

// 静态数据，避免重渲染
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
    { value: "general", label: "通用" }, { value: "advertisement_upbeat", label: "广告" }, { value: "affectionate", label: "亲切" }, { value: "angry", label: "生气" }, { value: "assistant", label: "助手" }, { value: "calm", label: "平静" }, { value: "chat", label: "聊天" }, { value: "cheerful", label: "开朗" }, { value: "customerservice", label: "客服" }, { value: "depressed", label: "沮丧" }, { value: "disgruntled", label: "不满" }, { value: "documentary-narration", label: "纪录片" }, { value: "embarrassed", label: "尴尬" }, { value: "empathetic", label: "有同理心" }, { value: "envious", label: "嫉妒" }, { value: "fearful", label: "害怕" }, { value: "friendly", label: "友好" }, { value: "gentle", label: "温柔" }, { value: "hopeful", label: "希望" }, { value: "lyrical", label: "抒情" }, { value: "newscast", label: "新闻" }, { value: "newscast-casual", label: "休闲新闻" }, { value: "newscast-formal", label: "正式新闻" }, { value: "poetry-reading", label: "诗歌" }, { value: "sad", label: "悲伤" }, { value: "serious", label: "严肃" }, { value: "shouting", label: "喊叫" }, { value: "sports_commentary", label: "体育评论" }, { value: "sports_commentary_excited", label: "激动体育评论" }, { value: "whispering", label: "耳语" }, { value: "terrified", label: "恐惧" }, { value: "unfriendly", label: "不友好" },
];
const roleOptions = [
    { value: "", label: "无角色扮演" }, { value: "Girl", label: "女孩" }, { value: "Boy", label: "男孩" }, { value: "YoungAdultFemale", label: "年轻女性" }, { value: "YoungAdultMale", label: "年轻男性" }, { value: "OlderAdultFemale", label: "中年女性" }, { value: "OlderAdultMale", label: "中年男性" }, { value: "SeniorFemale", label: "老年女性" }, { value: "SeniorMale", label: "老年男性" },
];

export default AudioForm;