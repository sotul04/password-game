import './gamerule.css'
import errorMark from '../../assets/error.png'
import checkMark from '../../assets/checkmark.png'
import refreshIcon from '../../assets/Refresh_4.png'

export default function GameRule({ number, type, description, onRefresh, isSatisfied, images }) {
    return (
        <div className={`${isSatisfied ? 'border-green-700 shadow-green-200 shadow-md' : 'border-red-700 shadow-red-200 shadow-md'} border rounded-xl rule-popup text-black relative text-left mt-4 mb-6`}>
            <span className={`flex ${isSatisfied ? 'bg-emerald-300' : 'bg-rose-300'} rounded-t-xl px-5 py-3`}>
                <img src={isSatisfied ? checkMark : errorMark} className='relative w-5 h-5 top-1 -left-1 pointer-events-none' alt='indicator-image' />
                <span className='text-left text-xl pl-2'>Rule {number}</span>
            </span>
            <div className={`${isSatisfied ? 'bg-emerald-100' : 'bg-rose-100'} rounded-b-xl text-xl p-5`}> 
                <span>{description}</span>
                {type === 'country' &&
                    <div className='flex justify-center mt-1'>
                        {images.map((item, index) => <img key={index} src={item.image} alt='country-flag' className='w-20 my-2 mx-4 hover:scale-110 transition' />)}
                    </div>
                }
                {type === 'captcha' &&
                    <div className='flex justify-center mt-3'>
                        <img src={images.image} alt='captcha-image' className='w-52 border-black border rounded-lg' />
                        <button onClick={onRefresh}>
                            <img src={refreshIcon} className='w-6 cursor-pointer hover:scale-110 transition ml-3' alt='refresh-button'/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}