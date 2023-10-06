const AWS = require("aws-sdk");
require("dotenv").config();


s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  });

//   const uploadToAws = async (folder, files) => {
//     const filesArray = Array.isArray(files) ? files : [files];
//     const uploadPromises = filesArray.map((file) => {
//       const params = {
//         Bucket: process.env.BUCKET_NAME,
//         Key: `${folder}/${file.name}`,
//         Body: file.data,
//         ACL: "public-read-write",
//         ContentType: "image/jpg/pdf",
//       };
  
//       return new Promise((resolve, reject) => {
//         s3.upload(params, (error, data) => {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             resolve(data.Location);
//           }
//         });
//       });
//     });
  
//     try {
//       const locations = await Promise.all(uploadPromises);
//     //   console.log("All files uploaded successfully:", locations);

//     return locations;
  
//       // If you need to perform additional actions, like updating a user, do it here
//       // Example: await user.findByIdAndUpdate({ _id: id }, { $push: { files: locations } });
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       // Handle the error as needed
//     }
//   };


const uploadToAws = async (mainFolder, folder, files) => {
    // Check if the main folder exists
    const mainFolderExists = await checkIfFolderExists(process.env.BUCKET_NAME, mainFolder);

    // If the main folder doesn't exist, create it
    if (!mainFolderExists) {
        await createFolder(process.env.BUCKET_NAME, mainFolder);
    }

    const filesArray = Array.isArray(files) ? files : [files];
    const uploadPromises = filesArray.map((file) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${mainFolder}/${folder}/${file.name}`, // Include the main folder in the Key
            Body: file.data,
            ACL: "public-read-write",
            ContentType: "image/jpg/pdf/jpeg",
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, (error, data) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    resolve(data.Location);
                }
            });
        });
    });

    try {
        const locations = await Promise.all(uploadPromises);
        return locations;
    } catch (error) {
        console.error("Error uploading files:", error);
        // Handle the error as needed
    }
};

// Function to check if a folder exists
const checkIfFolderExists = async (bucketName, folderName) => {
    try {
        await s3.headObject({ Bucket: bucketName, Key: folderName }).promise();
        return true; // Folder exists
    } catch (error) {
        if (error.code === "NotFound") {
            return false; // Folder does not exist
        } else {
            throw error; // Other error occurred
        }
    }
};

// Function to create a folder
const createFolder = async (bucketName, folderName) => {
    const params = {
        Bucket: bucketName,
        Key: folderName + "/", // Add trailing slash to indicate it's a folder
        Body: "", // Empty body for creating a folder
    };

    try {
        await s3.upload(params).promise();
    } catch (error) {
        console.error("Error creating folder:", error);
        // Handle the error as needed
    }
};


const deleteFile = async (fileLocation) => {
    const bucketName = process.env.BUCKET_NAME;

    // Extracting the key (file path) from the file location URL
    const key = fileLocation.replace(`https://${bucketName}.s3.amazonaws.com/`, '');

    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log("File deleted successfully:", fileLocation);
    } catch (error) {
        console.error("Error deleting file:", error.message);
        console.error("Error details:", error.stack);
        // Handle the error as needed
    }
};


  module.exports = { uploadToAws, deleteFile };
  