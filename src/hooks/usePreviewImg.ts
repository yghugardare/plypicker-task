"use client"
import { useState, ChangeEvent } from "react";

import { useToast } from "@/components/ui/use-toast";

const usePreviewImg = () => {
  // Specify the type of imgUrl as string or null
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgFile, setImageFile] = useState<File |null>(null);
  const [firebaseBase64UploadUrl, setFirebaseBase64UploadUrl] =
    useState<string>("");
  const { toast } = useToast()

  // Type the event parameter with ChangeEvent and specify the input element type
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get the file selected by the user
    const file = e.target.files?.[0];
    // Check if the file exists and is an image
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      console.log(file);
      // Use FileReader to read file contents asynchronously
      const reader = new FileReader();
      // When file reading ends
      reader.onloadend = () => {
        // Set imgUrl to the base64 URL obtained after reading
        if (reader.result) {
          if (typeof reader.result === "string") {
            setImgUrl(reader.result);
            setFirebaseBase64UploadUrl(reader.result.split(",")[1] as string);
          }
        }
      };

      // Read the file and encode it as a base64 URL
      reader.readAsDataURL(file);
    } else {
      // If file doesn't exist or isn't an image
      toast({
        variant : "destructive",
        title: "Invalid File Type",
          description: "Please Select an Image File",
      })
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl,imgFile,setImageFile,firebaseBase64UploadUrl,setFirebaseBase64UploadUrl };
};

export default usePreviewImg;
