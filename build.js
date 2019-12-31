const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const promisify = require('util');

const DESTINATION_FOLDER = 'dist';

function init() {
  const distFolder = path.resolve(__dirname, DESTINATION_FOLDER);
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder);
  }
  fs.readdir(path.resolve(__dirname, 'static'), onDirectoryRead);
  fs.readFile(path.resolve(__dirname, 'index.html'), (error, indexData) => {
    if (error) {
      return error;
    }
    const $ = cheerio.load(indexData);
    
    // Find any /static/ stuff served in the HTML and replace it to root
    $('[href^="/static"], [src^="/static"]').each( (idx, el) => {
      if (typeof $(el).attr() === 'object') {{
        Object.entries($(el).attr()).forEach( ([attr, val]) => {
          if (val.startsWith('/static/')) {
            $(el).attr(attr, val.replace('/static/', './'));
          }
        });
      }}
    });
    
    // Remove the last script tag, which is the auto-reloader
    $('script').last().remove();
    
    copyFileToDist('index.html', $.html());
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
      console.log('wrote file', fileName);
    }
  );
}

init();
