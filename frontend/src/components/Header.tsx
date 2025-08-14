import Logo from '@/assets/logo.svg?react';

const Header = () => (
    <header className="flex flex-col items-center text-center mb-10">
        <Logo className={'w-[80px]'} />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            言之有声
        </h1>
        <p className="mt-3 text-lg text-slate-400">
            让文字摆脱沉默的束缚
        </p>
    </header>
);

export default Header;