var path = require('path');

const CHUNK_SIZE = 3;
const DEPTH = 3;

function buildAttachmentPath(hash){
  var attachment_path = process.env.ATTACHMENTS_DIR;
  for(var j=0; j<DEPTH; j++){
    attachment_path = path.join(attachment_path, hash.substring((j*CHUNK_SIZE),((j+1)*CHUNK_SIZE)));
  }
  return attachment_path;
}

function getFileName(hash){
  return hash.substring( CHUNK_SIZE * DEPTH );
}

export {buildAttachmentPath, getFileName};