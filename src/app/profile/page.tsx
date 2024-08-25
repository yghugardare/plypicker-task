"use client"

import useUserStore from '@/store/user-store';


function page() {
    const user = useUserStore((state) => state.user);
    if(!user){
        <div>loading...</div>
    }
  return (
    <div>
        <div>
            Profile {user?.username}
        </div>
    </div>
  )
}

export default page