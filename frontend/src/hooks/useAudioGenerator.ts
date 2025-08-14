import { useState } from 'react';
import Api from '@/api'

export const useAudioGenerator = () => {
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

        try {
            const response = await fetch(Api.AudioSpeech, {
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

    return {
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
        error,
        audioUrl,
        handleSubmit,
    };
};
