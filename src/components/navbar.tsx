import React from 'react'


/*
*   TODO:
*   create a navbar compnonet
*   do whatever you want here, it will be included in the webpage
*   I already exported this function to layout.tsx
*/


/*
*   whenever you see something like below where "Navbar: React.FC"
*   this means that we are using a typescript feature to cast Navbar
*   to the React.FC type. Similar to "x=int(3)" in python where we
*   force x to be an integer type.
*   
*   In TypeScript, we make custom types to help with debugging by forcing 
*   errors when the wrong type is used for cases where javascript would 
*   just assume that the correct type is being used and cause bugs that are 
*   hard to fix.
*/
export const Navbar: React.FC = async () => {
    return (
        // type anything in between <nav> and </nav> and it will show at the top of the web page
        <nav>
            
        </nav>
    )
}

export default Navbar