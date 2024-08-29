"use client";

import { Button } from "@/components/ui/button";
import useSearchTermStore from "@/store/search-term-store";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { type Product } from "./admin-edit-product";
function EditProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useSearchTermStore();
  const { toast } = useToast();

  useEffect(() => {
    // Define an async function to fetch the products
    const fetchProducts = async () => {
      try {
        // Fetch the data from the API route
        const response = await fetch("/api/get-products");

        // Check if the response is successful
        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to fetch products",
            variant: "destructive",
          });
          return;
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the fetch was successful based on the response
        if (data.success) {
          setProducts(data.data);
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

    // Call the async function to fetch the products
    fetchProducts();
  }, [toast]);
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product?.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);
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

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-6">
      {filteredProducts.map((product) => (
        <div
          key={product._id}
          className="relative overflow-hidden shadow-secondary transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
        >
          <Image
            priority={true}
            src={product.productBase64ImageUrl || "/placeholder.svg"}
            alt={product.productName}
            width={500}
            height={400}
            className="object-cover w-full h-64"
            style={{ aspectRatio: "500/400", objectFit: "cover" }}
          />
          <div className="p-4 bg-background">
            <h3 className="text-xl font-bold">{product.productName}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {product.description}
            </p>
            <h4 className="text-lg font-semibold md:text-xl text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </h4>
            <Link href={`/dashboard/product/${product._id}`}>
              <Button variant="outline" className="mt-4 w-full">
                Edit Product
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </main>
  );
}

export default EditProduct;
