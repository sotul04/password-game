import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import './result.css';

const Result = forwardRef(function Result({ userWin, onReset, score }, ref) {

    const dialog = useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    });

    function updateBestScore() {
        const localGameState = JSON.parse(localStorage.getItem('bestPasswordGameScore')) || 0;
        if (score > localGameState) {
            localStorage.setItem('bestPasswordGameScore', JSON.stringify(score));
        }
    }

    return createPortal(
        <dialog ref={dialog} className="result-modal border-none rounded-lg p-8" onClose={() => {
            updateBestScore();
            onReset('Easy');
        }}>
            {!userWin ? <h2 className="font-mono mr-1 text-5xl text-center uppercase text-red-600">You lost</h2> : <h2 className="font-mono text-center mr-1 text-5xl uppercase text-green-500">You win</h2>}
            <h2 className="text-left mt-6 font-mono text-3xl pr-11">Your Score: {score}</h2>
            <form className="text-right" method="dialog" onSubmit={() => {
                updateBestScore();
                onReset('Easy');
            }}>
                <button className="mt-6 h-auto px-3 py-2 border-none rounded-xl bg-gray-600 text-white text-xl cursor-pointer hover:bg-gray-700 transition">Close</button>
            </form>
        </dialog>,
        document.getElementById('modal')
    );
})

export default Result;