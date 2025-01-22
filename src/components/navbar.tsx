"use client";

import React, { useState } from "react";

export const Navbar: React.FC = () => {
    const [isClick, setisClick] = useState(false);

    const toggleNavbar = () => {
        setisClick(!isClick);
    };

    return (

        <nav className="bg-white dark:bg-slate-800 shadow-md fixed w-full z-50" // add a dark: with darkmode colours
        > 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Dropdown Button */}
                    <div className="flex items-center">
                        <button
                            className={`inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white transition-transform duration-300 ease-in-out ${
                                isClick ? "rotate-90" : "rotate-0"
                            }`}
                            onClick={toggleNavbar}
                        >
                            <svg
                                className="h-6 w-6 transition-colors duration-300 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isClick ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                    {/* Centered Title */}
                    <div className="flex-grow text-center">
                        <a
                            href="/"
                            className="text-black dark:text-white font-extrabold transition-all duration-300 text-xl sm:text-2xl md:text-3xl"
                        >
                            TrueDermis
                        </a>
                    </div>
                </div>
            </div>
            {/* Dropdown Menu with Smooth Transition */}
            <div
                className={`bg-blue-900 dark:bg-zinc-900 overflow-hidden transition-all duration-300 ease-in-out ${
                    isClick ? "max-h-96" : "max-h-0"
                }`}
                
            >
                <div className="px-2 pt-4 pb-4 space-y-1">
                    <a
                        href="/"
                        className="text-white hover:bg-[#031f33] rounded-lg px-5 py-2 transition-colors duration-300 ease-in-out"
                    >
                        Upload
                    </a>
                    <a
                        href="/"
                        className="text-white hover:bg-[#031f33] rounded-lg px-5 py-2 transition-colors duration-300 ease-in-out"
                    >
                        Results
                    </a>
                    <a
                        href="/"
                        className="text-white hover:bg-[#031f33] rounded-lg px-5 py-2 transition-colors duration-300 ease-in-out"
                    >
                        Usage
                    </a>
                    <a
                        href="/"
                        className="text-white hover:bg-[#031f33] rounded-lg px-5 py-2 transition-colors duration-300 ease-in-out"
                    >
                        Purpose
                    </a>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
