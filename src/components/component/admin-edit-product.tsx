"use client";
import Image from "next/image";
import "react-image-crop/dist/ReactCrop.css";
import React, { FormEvent, SyntheticEvent, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { JSX, SVGProps } from "react";

import usePreviewImg from "@/hooks/usePreviewImg";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import setCanvasPreview from "@/hooks/setCanvasPreview";
import { useToast } from "../ui/use-toast";
import { convertImageUrlToBase64 } from "@/hooks/convertFirebaseUrltoBase64";
import { Delete, DeleteIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";


const MIN_WIDTH = 50;
const ASPECT_RATIO = 1;
export type Product = {
  _id: string;
  productName: string;
  price: string;
  description: string;
  productFirebaseImageLink: string;
  productBase64ImageUrl: string;
  imgType: string;
};

function AdminEditProduct({ product }: { product: Product }) {
  const [crop, setCrop] = useState<Crop>();
  const [productName, setProductName] = useState<string>(product.productName);
  const [price, setPrice] = useState<string>(product.price);
  const [description, setDescription] = useState<string>(product.description);
  // const [productFirebaseImageLink, setProductFirebaseImageLink] = useState<string>("");
  const [firebaseImage, setFirebaseImage] = useState<string>("");
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter()
  const {
    imgUrl,
    setImgUrl,
    handleImageChange,
    imgFile,
    firebaseBase64UploadUrl,
    setFirebaseBase64UploadUrl,
  } = usePreviewImg();

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { height, width } = e.currentTarget;
    const cropWidthPercent = (MIN_WIDTH / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };
  const say = () =>{
    console.log("some")
  }
  const handleEditProduct = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmiting(true);
    // checks if any changes are really made
    // this will help me avoiding unnecassary
    // API call to the db
    // console.log("base 64",product.productBase64ImageUrl)
    if (
      productName === product.productName &&
      description === product.description &&
      price === product.price &&
      firebaseBase64UploadUrl.length <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Make Changes",
        description:
          "No changes detected, If you really want to change a product please make atleast one change",
      });
      setSubmiting(false);
      return;
    }
    let imgFileType;
    // if croped the existing image
    if (!imgFile) {
      // toast({
      //   title : "Nahi hai"
      // })
      imgFileType = product.imgType;
    } else {
      // if uploaded new image
      // toast({
      //   title : "Hai"
      // })
      imgFileType = imgFile.type;
    }

    // console.log(imgFileType);
    // console.log(typeof imgFileType);
    const storageRef = ref(
      storage,
      `images/edited_products${product.productName}_${Date.now()}`
    );
    // let updatedProductOfAdmin = null;
    try {
      await uploadString(storageRef, firebaseBase64UploadUrl, "base64", {
        contentType: imgFileType,
      });
      let productFirebaseImageLink = null;
      if (firebaseBase64UploadUrl.length > 0) {
        productFirebaseImageLink = await getDownloadURL(storageRef);
        console.log(productFirebaseImageLink);
        setFirebaseImage(productFirebaseImageLink);
        console.log("You have either croped or upload img");
      }

      const updatedData = {
        productName,
        description,
        price,
        productFirebaseImageLink:
          productFirebaseImageLink || product.productFirebaseImageLink,
        productBase64ImageUrl: imgUrl || product.productBase64ImageUrl,
        imgType: imgFileType,
      };
      console.log(updatedData);
      const resp = await fetch(`/api/edit-product/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!resp.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to get response from sever",
        });
        setSubmiting(false);
        return;
      }
      const data = await resp.json();
      if (data.success === false) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        });
        setSubmiting(false);
        return;
      }
      toast({
        title: "Success!",
        description: data.message,
      });
      // updatedProductOfAdmin = data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product!",
      });
    } finally {
      // if(updatedProductOfAdmin){
      //   setProductName(updatedProductOfAdmin?.productName);
      //   setPrice(updatedProductOfAdmin?.price);
      //   setDescription(updatedProductOfAdmin?.description);
      //   setImgUrl(updatedProductOfAdmin?.productBase64ImageUrl)
      // }
      // toast({
      //   title : "Changes",
      //   description :"Here are your latest updated changes!!"
      // })
      setSubmiting(false);
    }
  };
  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/delete-product/${product?._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        });
        setDeleting(false);
        return;
      }
      toast({
        title: "Success",
        description: data.message,
      });
      // console.log('Product deleted successfully:', data.message);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product:" || error.message,
      });
    } finally {
      setDeleting(false);
      router.push("/dashboard/products")
    }
  };
  return (
    <main className="grid md:grid-cols-2 gap-8 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Product Image</h2>
        <div className="flex flex-col justify-center items-center gap-4">
          <div
            className={
              isCropping
                ? "h-[500px] w-full overflow-hidden"
                : "h-[500px] w-full overflow-hidden"
            }
          >
            {!isCropping && (
              <div className=" w-full h-[500px] bg-muted rounded-md ">
                <Image
                  src={imgUrl || product.productFirebaseImageLink || product.productBase64ImageUrl}
                  alt="Product Image"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            )}
            {isCropping && imgUrl && (
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                // onChange={(s)=>setCrop(s)}
                aspect={ASPECT_RATIO}
                minWidth={MIN_WIDTH}
                keepSelection={true}
                className="w-full h-[500px] bg-muted rounded-md relative"
              >
                <Image
                  ref={imageRef}
                  src={imgUrl}
                  alt="Product Image"
                  width={400}
                  height={400}
                  className="w-full h-full object-fill aspect-square "
                  onLoad={(e) => onImageLoad(e)}
                />
              </ReactCrop>
            )}
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={(e) => {
                if (imgUrl) {
                  setFirebaseBase64UploadUrl(imgUrl.split(",")[1]);
                }
                handleImageChange(e);
              }}
            />
          </div>
          <div className="flex items-center gap-x-10">
            {!isCropping && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileRef.current?.click()}
              >
                <UploadIcon className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            )}
            {isCropping && crop && (
              <Button
                variant="outline"
                className="w-full bg-[#3469e6] hover:bg-[#3469e6]"
                onClick={() => {
                  setCanvasPreview(
                    imageRef.current,
                    canvasRef.current,
                    convertToPixelCrop(
                      crop,
                      imageRef.current?.width || 0,
                      imageRef.current?.height || 0
                    )
                  );
                  const dataUrl: string | undefined =
                    canvasRef.current?.toDataURL();

                  if (dataUrl) {
                    setImgUrl(dataUrl);
                    setFirebaseBase64UploadUrl(dataUrl.split(",")[1]);
                    console.log(dataUrl);
                  }

                  setIsCropping(false);
                }}
              >
                <CircleCheckIcon className="w-5 h-5 mr-2" />
                Save Image
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // we want crop the existing image
                if (firebaseBase64UploadUrl.length <= 0) {
                  setImgUrl(product.productBase64ImageUrl);
                  setFirebaseBase64UploadUrl(
                    product.productBase64ImageUrl.split(",")[1]
                  );
                }

                setIsCropping((isCropping) => !isCropping);
              }}
            >
              <CropIcon className="w-5 h-5 mr-2" />
              {isCropping ? "Stop Cropping" : "Crop Image"}
            </Button>
          </div>
          {crop && <canvas className="mt-2 hidden" ref={canvasRef} />}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Edit Product as Admin</h2>
        <form className="grid gap-4" onSubmit={(e) => handleEditProduct(e)}>
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required={true}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Product Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required={true}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              rows={4}
              placeholder="Enter product description"
              required={true}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" className="justify-self-end">
              Add Product
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="justify-self-end"
                  
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  {!deleting ? "Delete" : "Deleting.."}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product and remove your data from our Database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProduct}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </main>
  );
}
function TrashIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CropIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  );
}

function UploadIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
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

export default AdminEditProduct;
