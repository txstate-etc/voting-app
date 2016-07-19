//This was used for my temporary UI

$(document).ready(function() {
    
    $('.resource-delete').click(function(event){
        event.preventDefault();
        var target = $(event.target);
        var url = "/" + target.attr('data-resource-type') + "/" + target.attr('data-resource-id');
        $.ajax({
            type: 'DELETE',
            url: url,
            success: function(response){
                console.log("The resource was deleted");
                target.closest('tr').remove();
            },
            error: function(response){
                console.log("The resource was not deleted");
            }
        });
    });

    $('.upvote, .downvote').click(function(event){
        var target = $(event.target);
        var data = {
            score: target.attr('data-score'),
            user_id: target.attr('data-user-id'),
            idea_id: target.attr('data-idea-id')
        };
        $.ajax({
            type: 'POST',
            url: '/votes',
            dataType: 'html',
            data: data,
            success: function(response){
                console.log("success");
            },
            error: function(xhr, status, error){
                console.log("there was an error");
            }
        });
    });
});