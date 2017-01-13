var moment = require('moment');
var browserHistory = require('react-router').browserHistory


//helper functions

export const dateToElapsedTime = (date) => {
    return moment(date).fromNow();
}


const isBlank = (str) => {
  if (str === undefined) return true;
  if (str.trim === undefined) return false;
  if (str.trim().length == 0) return true;
  return false;
}

export const isEmpty = (obj) => {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

export const createUrlQuery = (params) => {
  var pairs = [];
  for (var key in params) {
    if (params.hasOwnProperty(key) && !isBlank(params[key])) {
      pairs.push(encodeURIComponent(key)+'='+encodeURIComponent(params[key]));
    }
  }
  return '?'+pairs.join('&');
}

export const sumCommentsAndReplies = (comments) => {
    if(comments){
        var sum=comments.length;
        for(var i=0; i<comments.length; i++){
            sum += comments[i].replies.length;
        }
        return sum;
    }
    return 0;
}

export const getAttachmentIcon = (filename) => {
    var extension = filename.substr(filename.lastIndexOf('.')+1).toLowerCase();
    switch(extension){
        case 'jpg':
        case 'png':
        case 'jpeg':
            return "fa-file-image-o";
        case 'pdf':
            return "fa-file-pdf-o";
        case 'xls':
        case 'xlsx':
            return "fa-file-excel-o";
        case 'doc':
        case 'docx':
            return "fa-file-word-o";
        default:
            return "fa-file-o";
    }
}

export const handleErrors = (response) => {
    if (!response.ok) {
      if(response.status == 302) browserHistory.push('/login');
      throw Error(response.statusText);
    }
    return response;
}

export const parseJSON = (response) => {
  return response.json()
}
