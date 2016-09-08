var moment = require('moment');

function dateToElapsedTime(date){
    return moment(date).fromNow();
}

function sumCommentsAndReplies(comments){
    if(comments){
        var sum=comments.length;
        for(var i=0; i<comments.length; i++){
            sum += comments[i].replies.length;
        }
        return sum;
    }
    return 0;
}

function getAttachmentIcon(filename){
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

export {dateToElapsedTime, sumCommentsAndReplies, getAttachmentIcon};