async function convertImageUrlToBase64(imageUrl:string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
  
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }
export {convertImageUrlToBase64}
//   const firebaseImageUrl = "your-firebase-image-url";
//   convertImageUrlToBase64(firebaseImageUrl)
//     .then(base64Url => {
//       console.log(base64Url);
//     });