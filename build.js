const fs = require('fs');
const path = require('path');
const promisify = require('util');

const DESTINATION_FOLDER = 'dist';

function init() {
  fs.readdir(path.resolve(__dirname, 'static'), onDirectoryRead);
  fs.readFile(path.resolve(__dirname, 'index.html'), (error, indexData) => {
    if (error) {
      return error;
    }
    copyFileToDist('index.html', indexData);
  });
}

function onDirectoryRead(error, files) {
  console.log('Reading directory...');
  if (error) {
    return error;
  }

  files.forEach(file => {
    console.log('found file: ', file);
    fs.readFile(
      path.resolve(__dirname, 'static', file),
      (error, fileData) => {
        if (error) {
          return error;
        }
        return copyFileToDist(file, fileData);
      }
      
    );
  });
}

function copyFileToDist(fileName, fileData) {
  console.log('copying file:', fileName);
  
  fs.writeFile(
    path.resolve(__dirname, DESTINATION_FOLDER, fileName),
    fileData,
    (error) => {
      if (error) {
        return error;
      }
      console.log('wrote file', file);
    }
  );
}

init();