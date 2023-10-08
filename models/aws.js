const AWS = require("aws-sdk");
require("dotenv").config();
const config = require("../config/config")


s3 = new AWS.S3({
    accessKeyId: config.ACCESS_KEY,
    secretAccessKey: config.SECRET_KEY,
});


const uploadToAws = async (mainFolder, folder, files) => {
    // Check if the main folder exists
    const mainFolderExists = await checkIfFolderExists(config.BUCKET_NAME, mainFolder);

    // If the main folder doesn't exist, create it
    if (!mainFolderExists) {
        await createFolder(config.BUCKET_NAME, mainFolder);
    }

    const filesArray = Array.isArray(files) ? files : [files];
    const uploadPromises = filesArray.map((file) => {
        const params = {
            Bucket: config.BUCKET_NAME,
            Key: `${mainFolder}/${folder}/${file.name}`, // Include the main folder in the Key
            Body: file.data,
            ACL: "public-read-write",
            ContentType: "image/jpg/pdf/jpeg/png",
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
    const bucketName = config.BUCKET_NAME;

    const { pathname  } = new URL(fileLocation);

    // Extract the file key from the pathname and replace %20 with spaces
    const fileKey = decodeURIComponent(pathname.substring(1)).replace(/(%20|\+)/g, ' ');; // Remove the leading slash

    const params = {
        Bucket: bucketName,
        Key: fileKey,
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


module.exports = { uploadToAws, deleteFile, createFolder };
