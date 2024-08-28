"use client";

import AddProduct from "@/components/component/add-product";
import AdminAddProduct from "@/components/component/admin-add-product";
import useUserStore from "@/store/user-store";
import React from "react";

function AddPage() {
  const user = useUserStore((state) => state.user);

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
  return (
  
  <AddProduct/>
  // <AdminAddProduct/>
)
}

export default AddPage;
