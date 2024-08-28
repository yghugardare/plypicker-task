"use client";

import EditProduct from "@/components/component/edit-product";
import ProductsToDisplayForTeamMembers from "@/components/component/member-products";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/user-store";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

function EditPage() {
  const user = useUserStore((s) => s.user);
  if (!user) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        
        <h1 className="text-3xl">You need to Login to access this resource⚠️</h1>
        
      </div>
    );
  }
  if (user?.role !== "admin") {
    // or we could also redirect to / route
    // any how
    return <ProductsToDisplayForTeamMembers/>;
  }
  return (
    <EditProduct/>
  );
}

export default EditPage;
