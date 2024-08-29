import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { type Submission } from "./team-member-submissions";  
import { Button } from "../ui/button";

export function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch("/api/pending-requests");

        
        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to fetch pending requests",
            variant: "destructive",
          });
          return;
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the fetch was successful based on the response
        if (data.success) {
          setPendingRequests(data.data);
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

    // Call the async function to fetch the pending requests
    fetchPendingRequests();
  }, [toast]);

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

  if (pendingRequests.length === 0) {
    return <h1 className="text-3xl text-center">No Pending Requests</h1>;
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-6">
      {pendingRequests.map((request) => (
        <div
          key={request._id}
          className="relative overflow-hidden transition-transform shadow-muted duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
        >
          <Image
            src={request.productFirebaseImageLink || request.productBase64ImageUrl}
            alt={request.productName}
            width={500}
            height={400}
            className="object-cover w-full h-64"
            style={{ aspectRatio: "500/400", objectFit: "cover" }}
          />
          <div className="p-4 bg-background flex flex-col gap-1">
            <h3 className="text-xl font-bold">{request.productName}</h3>
            <p className="text-sm text-muted-foreground truncate">{request.description}</p>
            <div className="my-1">
              <Badge variant={"outline"} className="rounded-[1000px] bg-[#fde047] text-[#854d0e]">Pending</Badge>
            </div>
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold md:text-xl">
                ${parseFloat(request.price).toFixed(2)}
              </h4>
              <Link href={`/dashboard/pending-requests/${request._id}`}>
                <Button variant="outline" className="mt-4 w-full">
                  View Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
