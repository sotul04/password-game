import './header.css';

export default function Header({ score }) {
    return (
        <header className="w-screen">
            <h1 className={`text-center text-5xl mt-7 game-title text-amber-950 ${(score.score === 0 && score.bestScore === 0) ? 'mb-7' : undefined}`}>PasswordGame</h1>
            {(score.score > 0 || score.bestScore > 0) && 
                <div className="max-w-3xl mt-7 px-7 mx-auto flex justify-between h-28 rule-popup">
                    <div className="flex flex-col w-20 my-auto">
                        {score.score === 0 && <span></span>}
                        {score.score > 0 &&
                            <>
                                <span className="text-center font-mono text-2xl bg-slate-300 rounded-lg hover:scale-95 transition hover:bg-slate-100 animate-pulse">Score</span>
                                <span className="text-center mt-7 font-mono text-2xl animate-bounce">{score.score}</span>
                            </>}
                    </div>
                    <div className="flex flex-col w-20 my-auto">
                        {score.bestScore === 0 && <span></span>}
                        {score.bestScore > 0 &&
                            <>
                                <span className="text-center text-white font-mono text-2xl bg-blue-900 rounded-lg hover:scale-95 transition hover:bg-blue-500 animate-pulse">Best</span>
                                <span className="text-center mt-7 font-mono text-2xl animate-bounce">{score.bestScore}</span>
                            </>}
                    </div>
                </div>
            }
        </header>
    );
}