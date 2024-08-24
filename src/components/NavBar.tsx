"use client";

import Link from "next/link";
import { useState } from "react";
type User = {
    role?: "admin" | "team-member"
}
function NavBar() {
  const [user, setUser] = useState<User>({});
  function handleLogout() {
    console.log("Hello");
  }
  return (
    <nav className="h-[8vh] bg-background flex  items-center justify-between"> 
      <h1 className="font-semibold text-3xl font-sans ml-10">Ply<span className="text-primary italic">Picker</span></h1>
      <ul className="flex items-center mr-24 gap-x-10">
      {user?.role === "admin" && (
           <li>
             <Link href="/dashboard" className="text-white hover:text-primary">
               Dashboard
             </Link>
           </li>
         )}
         {user && user?.role !== "admin" && (
           <li>
             <Link href="/requests" className="text-white hover:text-primary">
               Requests
             </Link>
           </li>
         )}
         {user ? (
           <>
             <li>
               <Link href="/profile" className="text-white hover:text-primary">
                 Profile
               </Link>  
             </li>
             <li>
               <button onClick={handleLogout} className="text-white hover:text-primary">
                 Logout
               </button>
             </li>
           </>
         ) : (
           <li >
             <Link href="/login" className="text-white hover:text-primary">
               Login
             </Link>
           </li>
         )}
      </ul>
    </nav>
  );
}

export default NavBar;

{/* <div className="w-full h-[9vh] bg-blue-600 flex items-center relative">
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
    </div> */}