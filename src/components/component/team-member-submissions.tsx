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
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import useUserStore from "@/store/user-store";
// import { Button } from "../ui/button";
export interface Submission {
  _id: string;
  productId: string;
  productName: string;
  price: string;
  description: string;
  productFirebaseImageLink: string;
  productBase64ImageUrl: string;
  status: "pending" | "approved" | "rejected";
  author: string; // Email of the team member who submitted the review
  admin?: string | null; // Email of the admin who reviewed it (optional)
  createdAt: string;
  updatedAt: string;
}

export function TeamMemberSubmissions({ email }: { email: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Define an async function to fetch the submissions
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/my-submissions?email=${email}`);

        // Check if the response is successful
        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to fetch submissions",
            variant: "destructive",
          });
          return;
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the fetch was successful based on the response
        if (data.success) {
          setSubmissions(data.data);
        } else {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Call the async function to fetch the submissions
    fetchSubmissions();
  }, [toast, email]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl text-red-600">Error: {error}</h1>
      </div>
    );
  }
  if (submissions.length === 0) {
    return <h1 className="text-3xl text-center">No Submisions</h1>;
  }
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-6">
      {submissions.map((submission) => (
        <div
          key={submission._id}
          className="relative overflow-hidden transition-transform shadow-muted duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
        >
          <Image
            priority={true}
            src={
              submission.productFirebaseImageLink ||
              submission.productBase64ImageUrl
            }
            alt={submission.productName}
            width={500}
            height={400}
            className="object-cover w-full h-64"
            style={{ aspectRatio: "500/400", objectFit: "cover" }}
          />
          <div className="p-4 bg-background flex flex-col gap-1">
            <h3 className="text-xl font-bold">{submission.productName}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {submission.description}
            </p>
            <div className=" my-1">
              {submission.status === "approved" && (
                <Badge className="rounded-[1000px]">Approved</Badge>
              )}
              {submission.status === "rejected" && (
                <Badge variant={"destructive"} className="rounded-[1000px]">
                  Rejected
                </Badge>
              )}
              {submission.status === "pending" && (
                <Badge
                  variant={"outline"}
                  className="rounded-[1000px] bg-[#fde047] text-[#854d0e]"
                >
                  Pending
                </Badge>
              )}
            </div>

            <div className="flex justify-between">
              <h4 className="text-lg font-semibold md:text-xl">
                ${parseFloat(submission.price).toFixed(2)}
              </h4>
              <Link href={`/dashboard/my-submissions/${submission?._id}`}>
                <Button variant="outline" className="mt-4 w-full">
                  View Submission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
