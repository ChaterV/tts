interface AudioResultProps {
    audioUrl: string | null;
    error: string | null;
}

const AudioResult: React.FC<AudioResultProps> = ({ audioUrl, error }) => {
    if (!audioUrl && !error) return null;

    return (
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
    );
};

export default AudioResult;