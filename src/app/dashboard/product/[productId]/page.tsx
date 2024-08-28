"use client";
import AdminEditProduct from "@/components/component/admin-edit-product";
import TeamMemberEditRequest from "@/components/component/team-member-request-edit";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/store/user-store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type Product } from "@/components/component/admin-edit-product";
function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/get-product/${productId}`);
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch product data",
          });
        }
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          toast({
            variant: "destructive",
            title: "Error fetching product",
            description: data.message,
          });
        }
      } catch (error: any) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error fetching product",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, toast]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl">Fetching Products...</h1>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        
        <h1 className="text-3xl">You need to Login to access this resource⚠️</h1>
        
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  if(user?.role !== "admin"){
    return <TeamMemberEditRequest product={product}/>
  }else{
    return <AdminEditProduct product={product}/>
  }
}

export default ProductPage;
