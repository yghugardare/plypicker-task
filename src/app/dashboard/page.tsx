"use client"



import { DashboardOne } from "@/components/component/dashboard-one";
import Requests from "@/components/component/request";
import useUserStore from "@/store/user-store"


function DashBoardPage() {
  const user = useUserStore((state) => state.user);
  if(!user){
    <div>Loading User...</div>
  }
  return (
    <Requests/>
  )
}

export default DashBoardPage