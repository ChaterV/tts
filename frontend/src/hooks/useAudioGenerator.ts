import { useState } from 'react';
import Api from '@/api';

// [MODIFIED] 对话行结构现在包含所有参数
export interface DialogueLine {
    id: number;
    text: string;
    voice: string;
    role: string;
    style: string;
    speed: string;
    pitch: string;
    styleDegree: string;
}

export const useAudioGenerator = () => {
    const [isDialogueMode, setIsDialogueMode] = useState<boolean>(false);
    const [dialogue, setDialogue] = useState<DialogueLine[]>([
        {
            id: Date.now(),
            text: '',
            voice: 'zh-CN-XiaoxiaoNeural',
            role: '',
            style: 'general',
            speed: '1.0',
            pitch: '0',
            styleDegree: '1.0'
        }
    ]);

    const [text, setText] = useState<string>('');
    const [voice, setVoice] = useState<string>('zh-CN-XiaoxiaoNeural');
    const [speed, setSpeed] = useState<string>('1.0');
    const [pitch, setPitch] = useState<string>('0');
    const [voiceStyle, setVoiceStyle] = useState<string>('general');
    const [role, setRole] = useState<string>('');
    const [styleDegree, setStyleDegree] = useState<string>('1.0');

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

        try {
            // 对话模式发送整个包含完整参数的列表
            const body = isDialogueMode
                ? { dialogue }
                : {
                    input: text,
                    voice,
                    speed: parseFloat(speed),
                    pitch,
                    style: voiceStyle,
                    role,
                    styleDegree: parseFloat(styleDegree),
                };

            const response = await fetch(Api.AudioSpeech, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
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

    return {
        isDialogueMode,
        setIsDialogueMode,
        dialogue,
        setDialogue,
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
        role,
        setRole,
        styleDegree,
        setStyleDegree,
        isLoading,
        error,
        audioUrl,
        handleSubmit,
    };
};