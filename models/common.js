const fs = require('fs').promises

//Create Dir
const createDir = async (path) => {
  await fs.mkdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
}
// create File 
const createFile = async (filePath, fileData, fileEncoding) => {
  await fs.writeFile(filePath, fileData, { encoding: fileEncoding })
}

const checkAccess = function (role) {
  return async (req, res, next) => {
    try {
      let token, privateKey, verifyAccessToken
      if (req.headers.authorization && req.headers.authorization !== '' && req.headers.authorization !== null) {
        token = req.headers.authorization
        token = token.substring(7)
      }
      privateKey = await fs.readFile('privateKey.key', 'utf8');
      if (!token) {
        return res.status(401).send("Unauthorized Access")
      }
      try {
        verifyAccessToken = jwt.verify(token, privateKey, { algorithms: ["RS256"] })
      }
      catch (error) {
        return res.status(401).send("Unauthorized Access")
      }
      if (role.includes(verifyAccessToken.role) === false) {
        return res.status(401).send("Unauthorized Access")
      }
      next();
    } catch (error) { next(error) }
  }
}

// const AWS = require('aws-sdk');
// const fsfile = require('fs');

// // Configure AWS with your access and secret key.
// AWS.config.update({
//   accessKeyId: 'YOUR_ACCESS_KEY',
//   secretAccessKey: 'YOUR_SECRET_KEY',
//   region: 'YOUR_REGION'
// });

// const s3 = new AWS.S3();

// async function uploadFilesToS3(folderName, files) {
//   try {
//     // Ensure the folder name ends with a trailing slash
//     const folderKey = folderName.endsWith('/') ? folderName : `${folderName}/`;

//     // Iterate through each file and upload to S3
//     const uploadPromises = files.map(async file => {
//       const fileContent = fsfile.readFileSync(file.path);

//       const params = {
//         Bucket: 'YOUR_S3_BUCKET_NAME',
//         Key: `${folderKey}${file.originalname}`, // Set the file name in S3
//         Body: fileContent
//       };

//       await s3.upload(params).promise();
//     });

//     // Wait for all uploads to complete
//     await Promise.all(uploadPromises);

//     console.log('All files uploaded successfully.');
//   } catch (error) {
//     console.error('Error uploading files to S3:', error);
//   }
// }

// Example usage:
// const folderName = 'your-folder-name';
// const files = [
//   { path: 'path/to/file1.pdf', originalname: 'file1.pdf' },
//   { path: 'path/to/file2.pdf', originalname: 'file2.pdf' },
//   // Add more files as needed
// ];

// uploadFilesToS3(folderName, files);


module.exports = { createDir, createFile , checkAccess}