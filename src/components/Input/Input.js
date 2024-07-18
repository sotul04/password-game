import HighlightWithinTextarea from "react-highlight-within-textarea";
import './input.css';

export default function Input({ value, onChange, highlight }) {
    return (
        <section className="w-screen">
            <div className="max-w-3xl p-5 mr-auto ml-auto">
                <span className="flex justify-between">
                    <span className="text-xl text-gray-600">Please choose a password</span>
                    <span className="text-xl animate-bounce w-14 text-right">{value.length > 0 ? value.length : ""}</span>
                </span>
                <div className="flex items-center mt-1.5">
                    <div className="font-mono bg-white text-3xl text-left px-5 py-5 h-auto border border-solid border-black rounded-xl min-w-24 w-full">
                        <HighlightWithinTextarea
                            value={value}
                            onChange={onChange}
                            highlight={highlight}
                            placeholder=""
                            className="password-area"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}