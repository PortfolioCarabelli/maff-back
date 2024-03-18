const { ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const sharp = require('sharp');
const { storage } = require('../config/firebase');

async function uploadFile(file) {
    try {
      console.log("Starting file upload...", file);
      
      let fileBuffer = await sharp(file.buffer)
        .resize({ width: 200, height: 200, fit: 'cover' })
        .toBuffer();
      console.log("File resized successfully!");
      
      const fileRef = ref(storage, `files/${file.originalname + ' ' + Date.now()}`);
      console.log("File reference created:", fileRef.toString());
      
      const fileMetadata = {
        contentType: file.mimetype
      };
  
      const fileUploadPromise = uploadBytesResumable(
        fileRef,
        fileBuffer,
        fileMetadata
      );
      console.log("File upload promise created");
     
      await fileUploadPromise;
      console.log("File uploaded successfully!");
  
      const fileDownloadURL = await getDownloadURL(fileRef);
      console.log("Download URL:", fileDownloadURL);
      
      return { ref: fileRef, downloadURL: fileDownloadURL };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
}
module.exports = uploadFile;
