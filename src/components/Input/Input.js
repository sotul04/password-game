import HighlightWithinTextarea from "react-highlight-within-textarea";
import './input.css'

export default function Input({ value, onChange, highlight }) {
    return (
        <section className="password-container">
            <div className="password-box">
                <span>Please choose a password</span>
                <div className="password-box-inner">
                    <div className="password-input">
                        <HighlightWithinTextarea
                            value={value}
                            onChange={onChange}
                            highlight={highlight}
                            placeholder=""
                            className="password-area"
                        />
                    </div>
                    <span>{value.length > 0 ? value.length : ""}</span>
                </div>
            </div>
        </section>
    );
}