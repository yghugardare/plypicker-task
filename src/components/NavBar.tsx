"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useToast } from "./ui/use-toast";

// import { useEffect } from "react";

import { useEffect } from "react";
import useUserStore from "@/store/user-store";
import fetchUser from "@/lib/fetch-user";
import { ModeToggle } from "./mode-toggle";

function NavBar() {
  const router = useRouter();
  const { toast } = useToast();
  let user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(()=>{
    // trying to persist the value
    const storedUser = fetchUser();
    setUser(storedUser);
  },[setUser])
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("logedin-user");
    setUser(null)
    {
      toast({
        description: "User Loged Out!",
      });
    }
    router.push("/login");
  }

  return (
    <nav className="h-[8vh] bg-background flex  items-center justify-between">
      <Link href={"/"}><h1 className="font-semibold text-3xl font-sans ml-10">
        Ply<span className="text-primary italic">Picker</span>
      </h1></Link>
      <ul className="flex items-center mr-24 gap-x-10">
        <ModeToggle/>
        {user && (
          <li className="hover:text-primary">
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
        )}
        
        {user ? (
          <li className="hover:text-primary">
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li className="hover:text-primary">
            <Link href={"/login"}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;

{
  /* <div className="w-full h-[9vh] bg-blue-600 flex items-center relative">
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
    </div> */
}
