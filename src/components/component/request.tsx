"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
// no need
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { JSX, SVGProps, useEffect, useState } from "react";
import AddProduct from "./add-product";
import useUserStore from "@/store/user-store";
import { truncateString } from "@/lib/truncateString";
interface RecentReview {
  _id: string;
  productId: string;
  productName: string;
  status: "approved" | "rejected";
  author: string;
}
function Requests() {
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [stats, setStats] = useState({
    totalReviewsCount: 0,
    acceptedReviewsCount: 0,
    rejectedReviewsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await fetch(
          `/api/review-stats?adminEmail=${user?.email}`
        );

        if (!response.ok) {
          setError("Failed to fetch review statistics");
          return;
        }

        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message);
        }
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, [user?.email]);
  useEffect(() => {
    const fetchRecentRequests = async () => {
      setLoading(true);
      setError(null); // Reset error state before making the request

      try {
        const response = await fetch(
          `/api/admin-recent-reqs?userEmail=${user?.email}`
        );
        console.log(user?.email);

        if (!response.ok) {
          setError("Failed to fetch recent requests");
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setRecentReviews(data.data);
          console.log(data.data);
        } else {
          setError(data.message);
        }
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRequests();
  }, [user?.email]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <main className="p-4 md:p-6  ">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-[#53e0e7]" />
              <CardTitle className="text-sm font-medium">
                Total Requests Received
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{stats.totalReviewsCount}</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleCheckIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">
                Total Requests Approved
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">
              {stats.acceptedReviewsCount}
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleXIcon className="h-5 w-5 text-[red]" />
              <CardTitle className="text-sm font-medium">
                Total Requests Rejected
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">
              {stats.rejectedReviewsCount}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="md:mt-6 mt-4 py-2 ">
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Product Id</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Team Member</TableHead>
                <TableHead>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    <div className="font-medium">
                      {truncateString(review._id, 10)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{truncateString(review.productId, 10)}</div>
                  </TableCell>
                  <TableCell>
                    <div>{review.productName}</div>
                  </TableCell>
                  <TableCell>
                    {review.status === "approved" && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-[1000px] bg-primary" />
                        <div>Approved</div>
                      </div>
                    )}
                    {review.status === "rejected" && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-[1000px] bg-[red]" />
                        <div>Rejected</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{review.author}</div>
                  </TableCell>
                  <TableCell>
                    <Link href={"/dashboard/my-submissions/" + review._id}>
                      <Button variant={"secondary"}>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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

function CircleXIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function FilePenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function InboxIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function UsersIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default Requests;

{
  /* <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="md:hidden">
            <div className="grid gap-4 p-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
              >
                <InboxIcon className="h-5 w-5" />
                Requests
              </Link>
              <Link
                href="/dashboard/add"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
              >
                <PlusIcon className="h-5 w-5" />
                Add Product
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
              >
                <FilePenIcon className="h-5 w-5" />
                Edit Products
              </Link>
              <Link
                href="/dashboard/pending-requests"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                prefetch={false}
              >
                <CircleCheckIcon className="h-5 w-5" />
                Review Requests
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#" prefetch={false}>
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Requests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DropdownMenu>
          <DropdownMenuTrigger asChild />
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header> */
}
