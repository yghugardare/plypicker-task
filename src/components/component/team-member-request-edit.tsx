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

const MIN_WIDTH = 50;
const ASPECT_RATIO = 1;
type Product = {
    _id: string;
    productName: string;
    price: string;
    description: string;
    productFirebaseImageLink: string;
  };

function TeamMemberEditRequest({product}:{product:Product}) {
    const [crop, setCrop] = useState<Crop>();
  const [productName, setProductName] = useState<string>(product.productName);
  const [price, setPrice] = useState<string>(product.price);
  const [description, setDescription] = useState<string>(product.description);
  // const [productFirebaseImageLink, setProductFirebaseImageLink] = useState<string>("");
  const [firebaseImage, setFirebaseImage] = useState<string>("");
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
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
  const handleEditProduct = (e:SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

  }
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
                  src={imgUrl || product.productFirebaseImageLink}
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
              onClick={() => setIsCropping((isCropping) => !isCropping)}
            >
              <CropIcon className="w-5 h-5 mr-2" />
              {isCropping ? "Stop Cropping" : "Crop Image"}
            </Button>
          </div>
          {crop && <canvas className="mt-2 hidden" ref={canvasRef} />}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
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
          <Button
            type="submit"
            className="justify-self-end"
            disabled={submiting}
          >
            {submiting ? "Submiting..." : "Submit Changes for Approval"}
          </Button>
        </form>
      </div>
    </main>
  )
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
 

export default TeamMemberEditRequest