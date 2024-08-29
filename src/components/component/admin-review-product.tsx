"use client";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { JSX, SVGProps, useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { type Product } from "./admin-edit-product";
import { Submission } from "./team-member-submissions";
import useUserStore from "@/store/user-store";
function AdminReviewProduct() {
  const { requestId } = useParams();
  const { toast } = useToast();

  const [review, setReview] = useState<Submission>();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reject/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminEmail: user?.email }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to reject the review",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });

        router.push("/dashboard");
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
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async () => {
    setLoading(true);
    console.log(user?.email);
    try {
      const response = await fetch(`/api/approve/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminEmail: user?.email }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to approve the review",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
        //  redirect to dashboard
        router.push("/dashboard");
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!requestId) return;

    const fetchReviewAndProduct = async () => {
      try {
        const response = await fetch(`/api/pending-requests/${requestId}`);

        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to fetch review and product details",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();

        if (data.success) {
          setReview(data.data.review);
          setProduct(data.data.product);
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

    fetchReviewAndProduct();
  }, [requestId, toast]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  }

  if (error || !review || !product) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl text-red-600">
          Error: {error || "Data not found"}
        </h1>
      </div>
    );
  }
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Original Product</h2>
        <Card>
          <CardContent className="grid gap-4">
            <div className="aspect-square bg-muted rounded-md overflow-hidden">
              <Image
                src={product.productBase64ImageUrl}
                alt="Place holder"
                width={300}
                height={300}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{product.productName}</h3>
                <div className="text-lg font-bold">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div className="md:flex  items-center gap-x-2">
          <h2 className="text-xl font-bold">Requested Changes</h2>
          <h3 className="text-md font-semibold">
            [Team member - {review.author}]
          </h3>
        </div>
        <Card>
          <CardContent className="grid gap-4">
            <div className="aspect-square  rounded-md overflow-hidden ">
              <Image
                src={review.productBase64ImageUrl}
                alt="Requested Product Image"
                width={300}
                height={300}
                className="w-full h-full object-cover aspect-square rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{review.productName}</h3>
                <div className="text-lg font-bold">
                  ${parseFloat(review.price).toFixed(2)}
                </div>
              </div>
              <p className="text-muted-foreground">{review.description}</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button
            variant="destructive"
            className="font-bold"
            onClick={handleReject}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="font-bold">
                <CircleCheckIcon className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently change the
                  product to the changes suggested by the team-memeber.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Wait,Let me think!</AlertDialogCancel>
                <AlertDialogAction onClick={handleApprove}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
