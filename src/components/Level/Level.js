import { useState } from "react";

const options = ['Easy', 'Medium', 'Hard']

export default function Level({ level, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(prev => !prev);

    return (
        <section className="w-screen">
            <div className="max-w-3xl px-5 pb-1 mr-auto ml-auto flex flex-col">
                <span className="text-lg mb-1 text-gray-600">Choose your diffculty</span>
                <div className="inline-flex ">
                    <div className='min-w-[150px] relative inline-flex rounded-md bg-white'>
                        <p
                            className="w-[100%] rounded-l-md px-4 py-2 text-xl text-gray-800 no-underline"
                        >
                            {level}
                        </p>
                        <div className="relative">
                            <button onClick={toggle}
                                type='button'
                                className={`button-${isOpen ? 'danger' : 'success'} hover:text-gray-700 inline-flex h-full items-center justify-center rounded-r-md border-l border-gray-100 px-2 text-gray-600 hover:bg-gray-50`}
                            >
                                <svg
                                    xmins="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>
                        {isOpen &&
                            <div className="absolute top-6 right-0 z-10 mt-4 min-w-[150px] origin-top-right rounded-md border border-gray-100 bg-white shadow-lg flex flex-col">
                                {options.map((item, index) =>
                                    <button key={index} onClick={() => {
                                        onChange(item);
                                        setIsOpen(false);
                                    }} className="hover:bg-gray-100">
                                        <p className="w-[100%] rounded-l-md px-4 py-2 text-xl text-gray-500 no-underline text-left">
                                            {item}
                                        </p>
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}