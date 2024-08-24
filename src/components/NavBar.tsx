"use client";

import Link from "next/link";
import { useState } from "react";

function NavBar() {
  const [user, setUser] = useState({});
  function handleLogout() {
    console.log("Hello");
  }
  return (
    <div className="w-full h-[9vh] bg-blue-600 flex items-center relative">
        <h1 className="text-2xl absolute md:left-10 left-5">PlyPicker</h1>
        <nav className="p-4 flex items-center justify-center w-full h-full">
       
       <ul className="flex md:gap-x-10 items-center md:justify-center w-full justify-end gap-x-6 ">
         {user?.role === "admin" && (
           <li>
             <Link href="/dashboard" className="text-white">
               Dashboard
             </Link>
           </li>
         )}
         {user && user?.role !== "admin" && (
           <li>
             <Link href="/requests" className="text-white">
               Requests
             </Link>
           </li>
         )}
         {user ? (
           <>
             <li>
               <Link href="/profile" className="text-white">
                 Profile
               </Link>  
             </li>
             <li>
               <button onClick={handleLogout} className="text-white mr-2">
                 Logout
               </button>
             </li>
           </>
         ) : (
           <li className="flex justify-end w-full ">
             <Link href="/login" className="text-white mr-6">
               Login
             </Link>
           </li>
         )}
       </ul>
     </nav>
    </div>
  );
}

export default NavBar;
