"use client";

import EditProduct from "@/components/component/edit-product";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/user-store";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  return (
    <EditProduct/>
  );
}

export default EditPage;
