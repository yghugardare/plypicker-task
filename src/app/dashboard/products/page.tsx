"use client";

import useUserStore from "@/store/user-store";

function EditPage() {
  const user = useUserStore((s) => s.user);
  if(!user){ 
    return <div className="w-full h-full flex justify-center items-center">

        <h1 className="text-3xl">Loading...</h1>
    </div>
  }
  if (user?.role !== "admin") {
    // or we could also redirect to / route
    // any how
    return <h1>You are not authorized to access this route</h1>;
  }
  return <div>EditPage</div>;
}

export default EditPage;
