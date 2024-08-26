"use client";

import AddProduct from "@/components/component/add-product";
import useUserStore from "@/store/user-store";
import React from "react";

function AddPage() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    <div>Loading User...</div>;
  }
  if (user?.role !== "admin") {
    // or we could also redirect to / route
    // any how
    return <h1>You are not authorized to access this route</h1>;
  }
  return <AddProduct />;
}

export default AddPage;
