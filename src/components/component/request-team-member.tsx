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
export interface RecentReview {
  _id: string;
  productId: string;
  productName: string;
  status: "approved" | "rejected";
  admin: string;
}
function RequestsTeamMember() {
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [stats, setStats] = useState({
    totalRequestsCount: 0,
    acceptedRequestsCount: 0,
    rejectedRequestsCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore(s=>s.user)
  useEffect(() => {
    const fetchTeamMemberStats = async () => {
      try {
        const response = await fetch(`/api/team-member-stats?authorEmail=${user?.email}`);

        if (!response.ok) {
          setError("Failed to fetch team member statistics");
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

    fetchTeamMemberStats();
  }, [user?.email]);
  useEffect(() => {
    const fetchRecentRequests = async () => {
      setLoading(true);
      setError(null); // Reset error state before making the request

      try {
        const response = await fetch(`/api/recent-requests?userEmail=${user?.email}`);
        console.log(user?.email)

        if (!response.ok) {
          setError("Failed to fetch recent requests");
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setRecentReviews(data.data);
          console.log(data.data)
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
                  Total Requests Made
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{stats.totalRequestsCount}</div>
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
              <div className="text-2xl font-bold">{stats.acceptedRequestsCount}</div>
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
              <div className="text-2xl font-bold">{stats.rejectedRequestsCount}</div>
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
                  <TableHead>Admin</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  recentReviews.map((review) => (
                    <TableRow key={review._id}>
                    <TableCell>
                      <div className="font-medium">{truncateString(review._id,10)}</div>
                    </TableCell>
                    <TableCell>
                      <div>{truncateString(review.productId,10)}</div>
                    </TableCell>
                    <TableCell>
                      <div>{review.productName}</div>
                    </TableCell>
                    <TableCell>
                      { review.status === "approved" &&
                        <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-[1000px] bg-primary" />
                        <div>Approved</div>
                      </div>
                      }
                      { review.status === "rejected" &&
                        <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-[1000px] bg-[red]" />
                        <div>Rejected</div>
                      </div>
                      }
                    </TableCell>
                    <TableCell>
                      <div>{review.admin}</div>
                    </TableCell>
                    <TableCell>
                      <Link href={"/dashboard/my-submissions/"+review._id}>
                      <Button variant={"secondary"}>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  ))
                }
                
                
               
                
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

export default RequestsTeamMember;
