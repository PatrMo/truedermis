import React from 'react'


/*
* TODO:
* create a navbar compnonet
* do whatever you want here, it will be included in the webpage
* I already exported this function to layout.tsx
*/

export const Navbar: React.FC = async () => {
    return (
        // type anything in between <nav> and </nav> and it will show at the top of the web page
        // I made a simpple navbar edit the css as you please
        <nav className='flex justify-center items-center h-16 bg-white border-2 border-blue-500 rounded-lg shadow-md'>
            <p className="text-center text-lg font-semibold text-gray-700">Hello</p>
        </nav>
    )
}

export default Navbar