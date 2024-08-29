"use client";


import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { JSX, SVGProps, useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { type Product } from "./admin-edit-product";
import { Submission } from "./team-member-submissions";
// import Image from "next/image";
import { Badge } from "../ui/badge";

function TeamMemberReview() {
  const { submissionId } = useParams();
  const { toast } = useToast();

  const [review, setReview] = useState<Submission>();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;

    const fetchReviewAndProduct = async () => {
      try {
        const response = await fetch(`/api/pending-requests/${submissionId}`);

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
  }, [submissionId, toast]);

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
                src={
                  product.productFirebaseImageLink ||
                  product.productBase64ImageUrl
                }
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
            [Review Submitted -{" "}
            {formatDistanceToNow(new Date(review.createdAt))} ago]
          </h3>
        </div>
        <Card>
          <CardContent className="grid gap-4">
            <div className="aspect-square  rounded-md overflow-hidden ">
              <Image
                src={
                  review.productFirebaseImageLink ||
                  review.productBase64ImageUrl
                }
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
        <div className="flex justify-end">
          {review.status === "pending" && (
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
          )}
          {review.status === "approved" && (
            <Badge className="px-4 py-2 rounded-[10000px]" variant={"default"}>
              Approved
            </Badge>
          )}
          {review.status === "rejected" && (
            <Badge
              className="px-4 py-2 rounded-[10000px]"
              variant={"destructive"}
            >
              Rejected
            </Badge>
          )}
        </div>
        {review.status === "approved" && (
          <p className="text-md text-secondary-foreground italic">
            Approved by{" "}
            <span className="text-lg text-primary not-italic">
              {review.admin}
            </span>
          </p>
        )}
        {review.status === "rejected" && (
          <p className="text-md text-secondary-foreground italic ">
            Rejected by{" "}
            <span className="text-lg text-primary not-italic">
              {review.admin}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}

export default TeamMemberReview;
/*  

*/
