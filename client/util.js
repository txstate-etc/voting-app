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

export {dateToElapsedTime, sumCommentsAndReplies};