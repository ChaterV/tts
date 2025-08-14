import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import AudioForm from './components/AudioForm';
import AudioResult from './components/AudioResult';
import { useAudioGenerator } from './hooks/useAudioGenerator';

function App() {
    const {
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
        role,
        setRole,
        styleDegree,
        setStyleDegree,
        isDialogueMode,
        setIsDialogueMode,
        dialogue,
        setDialogue
    } = useAudioGenerator();

    const pageTitle = audioUrl ? `音频已生成 - ${text.substring(0, 20)}...` : "言之有声 - 智能文本转语音工具";
    const pageDescription = text ? `将文本 “${text.substring(0, 100)}...” 转换为自然流畅的语音。` : "言之有声是一款免费的在线文本转语音（TTS）工具，提供多种自然发音人选择和语音风格调整，轻松将您的文字转换成高质量音频。";

    return (
        <div className="w-full min-h-screen bg-slate-900 text-slate-300 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Helmet>
            <div className="w-full max-w-7xl mx-auto">
                <Header />
                <main className="w-full">
                    <AudioForm
                        text={text}
                        setText={setText}
                        voice={voice}
                        setVoice={setVoice}
                        speed={speed}
                        setSpeed={setSpeed}
                        pitch={pitch}
                        setPitch={setPitch}
                        voiceStyle={voiceStyle}
                        setVoiceStyle={setVoiceStyle}
                        role={role}
                        setRole={setRole}
                        styleDegree={styleDegree}
                        setStyleDegree={setStyleDegree}
                        isDialogueMode={isDialogueMode}
                        setIsDialogueMode={setIsDialogueMode}
                        dialogue={dialogue}
                        setDialogue={setDialogue}
                        isLoading={isLoading}
                        handleSubmit={handleSubmit}
                    />
                    <AudioResult audioUrl={audioUrl} error={error} />
                </main>
            </div>
        </div>
    );
}

export default App;
