import './gamerule.css'
import errorMark from '../../assets/error.png'
import checkMark from '../../assets/checkmark.png'

export default function GameRule({ number, type, description, onRefresh, isSatisfied }) {


    return (
        <div className={`${isSatisfied ? 'border-green-700' : 'border-red-700'} border rounded-xl rule-popup text-black relative text-left mt-4 mb-6 `}>
            <span className={`flex ${isSatisfied ? 'bg-emerald-300' : 'bg-rose-300'} rounded-t-xl p-5`}>
                <img src={isSatisfied ? checkMark : errorMark} className='relative w-5 h-5 top-1 -left-1 pointer-events-none' alt='indicator-image' />
                <span className='text-left text-xl pl-2'>Rule {number}</span>
            </span>
            <div className={`${isSatisfied ? 'bg-emerald-100' : 'bg-rose-100'} rounded-b-xl text-xl p-5`}>
                <span>{description}</span>
            </div>
        </div>
    );
}