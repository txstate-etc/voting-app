var moment = require('moment');

function dateToElapsedTime(date){
    return moment(date).fromNow();
}

export {dateToElapsedTime};