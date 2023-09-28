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

  module.exports = {createDir, createFile}