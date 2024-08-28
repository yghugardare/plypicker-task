"use client"

import { TeamMemberSubmissions } from "@/components/component/team-member-submissions";
import useUserStore from "@/store/user-store";
import React, { useEffect } from "react";

function SubmissionsPage() {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        
        <h1 className="text-3xl">You need to Login to access this resource⚠️</h1>
        
      </div>
    );
  }
  if(user?.role === "admin"){
    return <h1 className="text-3xl w-full text-center text-[tomato]">Admin Not Allowed</h1>
  }
  return <div>
    <TeamMemberSubmissions email={user.email}/>
  </div>;
}

export default SubmissionsPage;
