import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";

import SCORE from "../../model/Score";

const LevelDialog = forwardRef(function LevelDialog({ onChangeLevel }, ref) {

    const [currentNewLevel, setCurrentNewLevel] = useState(SCORE.newLevel);

    const dialog = useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            },
            changeNewLevel(newLevel) {
                setCurrentNewLevel(newLevel);
            }
        }
    });

    return createPortal(
        <dialog ref={dialog} className="result-modal border-none rounded-lg p-8" onClose={() => {
        }}>
            <h2 className="font-mono mr-1 text-5xl text-center uppercase text-red-600">Difficulty Change</h2>
            <h2 className="text-left mt-6 font-mono text-3xl pr-11">Are you sure to change difficulty to {currentNewLevel}?</h2>
            <p className="text-red-700 text-2xl font-mono">Your game progress to date will not be saved</p>
            <div className="flex justify-end mt-6">
                <button className="mh-auto px-3 py-2 border-none rounded-xl bg-white text-black text-xl cursor-pointer hover:bg-gray-300 transition" onClick={ () => {
                    dialog.current.close();
                } }>Cancel</button>
                <button className="ml-4 h-auto px-3 py-2 border-none rounded-xl bg-red-700 text-white text-xl cursor-pointer hover:bg-red-400 transition" onClick={ () => {
                    dialog.current.close();
                    onChangeLevel(SCORE.newLevel);
                } }>Ok</button>
            </div>
        </dialog>,
        document.getElementById('modal')
    );
})

export default LevelDialog;