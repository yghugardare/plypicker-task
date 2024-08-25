"use client"


import useUserStore from "@/store/user-store"


function page() {
  const user = useUserStore((state) => state.user);
  if(!user){
    return (
      <div>Loading...</div>
    )
  }
  return (
    <div className="">
        <div>
            Dashboard {user?.role}
        </div>
    </div>
  )
}

export default page