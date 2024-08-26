"use client"



import { DashboardOne } from "@/components/component/dashboard-one";
import Requests from "@/components/component/request";
import RequestsTeamMember from "@/components/component/request-team-member";
import useUserStore from "@/store/user-store"


function DashBoardPage() {
  const user = useUserStore((state) => state.user);
  if(!user){ 
    return <div className="w-full h-full flex justify-center items-center">

        <h1 className="text-3xl">Loading...</h1>
    </div>
  }
  if(user?.role === "admin"){
    return (
      <Requests/>
    )
  }else{
    return (
      <RequestsTeamMember/>
    )
  }
}

export default DashBoardPage