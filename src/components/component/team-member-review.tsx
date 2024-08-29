"use client";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { JSX, SVGProps } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";

function TeamMemberReview() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Original Product</h2>
        <Card>
          <CardContent className="grid gap-4">
            <div className="aspect-square bg-muted rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg"
                alt="Product Image"
                width={300}
                height={300}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Original Product</h3>
                <div className="text-lg font-bold">$99</div>
              </div>
              <p className="text-muted-foreground">
                This is the description for the original product.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Requested Changes</h2>
        <Card>
          <CardContent className="grid gap-4">
            <div className="aspect-square  rounded-md overflow-hidden ">
              <Image
                src="/placeholder.svg"
                alt="Requested Product Image"
                width={300}
                height={300}
                className="w-full h-full object-cover aspect-square rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Requested Product</h3>
                <div className="text-lg font-bold">$149</div>
              </div>
              <p className="text-muted-foreground">
                This is the description for the requested product.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Badge
            variant={"outline"}
            className="rounded-[1000px] bg-[#fde047] px-4 py-2 text-[#854d0e]  flex items-center gap-x-2"
          >
            <span className="relative flex rounded-lg  h-2.5 w-2.5">
              <span
                id="sp"
                className="rounded-lg bg-[#854d0e] w-full h-full absolute "
              ></span>
              <span className="w-full h-full  rounded-lg bg-[#854d0e]"></span>
            </span>
            <span>Pending</span>
          </Badge>
        </div>
      </div>
    </main>
  );
}

export default TeamMemberReview;
