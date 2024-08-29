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

function AdminReviewProduct() {
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
        <div className="flex justify-end gap-2">
          <Button variant="destructive" className="font-bold">
            <XIcon className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button className="font-bold">
            <CircleCheckIcon className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </main>
  );
}

function CircleCheckIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default AdminReviewProduct;
