"use client";

import { UserObjectType } from "@/app/api/get-user/route";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

function NavBar() {
  const [user, setUser] = useState<UserObjectType | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    async function getUserData() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("User not loged in");
        return;
      }
      try {
        const res = await fetch("/api/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          toast({
            title : data.user.role,
            description: `Welcome! ${data.user.username}`,
          });
          router.push("/")
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data?.message || "Something went wrong!",
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error?.message || "Something went wrong!",
        });
      }
    }
    getUserData();
  }, [toast,router,setUser]);
  
  function handleLogout() {
    localStorage.removeItem("token");
    {
      toast({
        description : "User Loged Out!"
      })
    }
    router.push("/login");
  }

  return (
    <nav className="h-[8vh] bg-background flex  items-center justify-between">
      <h1 className="font-semibold text-3xl font-sans ml-10">
        Ply<span className="text-primary italic">Picker</span>
      </h1>
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
              <button
                onClick={handleLogout}
                className="text-white hover:text-primary"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
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
