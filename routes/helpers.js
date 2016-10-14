var helpers = {

    formatSearchWords: function(q){
        var searchWords;
        searchWords = q.split(/[^a-z@]+/i);
        return searchWords;
    }
}

module.exports = helpers;