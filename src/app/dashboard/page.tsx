"use client"



import { DashboardOne } from "@/components/component/dashboard-one";
import useUserStore from "@/store/user-store"


function DashBoardPage() {
  const user = useUserStore((state) => state.user);
  if(!user){
    return (
      <div>Loading...</div>
    )
  }
  return (
    <div className="">
       <DashboardOne/>
    </div>
  )
}

export default DashBoardPage