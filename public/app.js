$.getJSON("/articles", function(data) {
    $(".article-container").empty();
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        $(".article-container").prepend(
            '<div class = "panel panel-primary panel-article" data-id="' + data[i]._id + '">' +
            '<div class= "panel-title">' +
            "<a href= '" + data[i].link +
            "'><h3>" + data[i].title +
            "</h3></a><div class = 'btn btn-success save'> Add Comment</div>" + '<div class = "panel-body"><h5>' +
            data[i].summary +
            "</h5></div>" + "</div>");
    }
});
$(document).ready(function() {

    $(".scrape-new").on("click", function() {
        $.ajax({
                method: "GET",
                url: "/scrape"
            })
            .done(function(data) {
                console.log("done");
                location.href = "/";
            })

    });


    //get the article by id and show a comment section to user
    $(".panel-article").on("click", function() {
        var articleId = $(this).attr("data-id");
        $("#comments-panel").show();
        $("#comments").empty();
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).done(function(data) {
            //building the comment section form
            $("#comment-title").html(data.title);
            $("#comment-new").empty();
            $("#comment-new").append('<div class="row">' +
                '<div class="col-xs-12"><div class="form-group">' +
                '<label for="bodyinput" class="col-lg-2 control-label">' +
                'Comment</label><div class="col-lg-8"><input type="text"' +
                'class="form-control" id="bodyinput" placeholder="Comment">' +
                '</div><div class="col-lg-2"><div class="btn btn-info btn-block"' +
                'data-id=' + data._id + ' id="savenote">Save</div></div></div></div></div>');


            //rendering comment list
            if (data.comment) {
                // Place the body of the note in the body textarea
                for (var i = 0; i < data.comment.length; i++) {
                    console.log(data.comment);
                    $("#comments").prepend('<li data-id=' + data.comment[i]._id + '>-- ' + data.comment[i].body + '   <span class= "btn btn-warning deleter">  X</span></li>');
                }
            }
        });
    });


    $(document).on("click", "#savenote", function() {
        var articleId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: $("#bodyinput").val(),
                created: Date.now()
            }
        }).done(function(data) {});
        //add comment and clear form box (but not populating data-id and x to delete)
        $("#comments").prepend("<li>- " + $("#bodyinput").val() + "</li>");
        $("#bodyinput").val("");
    });


    // When user clicks the deleter button for a note
    $(document).on("click", ".deleter", function() {

        var selected = $(this).parent();
        // Make an AJAX GET request to delete the specific comment
        // this uses the data-id of the div-tag, which is linked to the specific comment
        console.log(selected.attr("data-id"));

        $.ajax({
            type: "GET",
            url: "/delete/" + selected.attr("data-id"),

            // On successful call
            success: function(response) {
                // Remove the div-tag from the DOM
                selected.remove();
                // Clear the comment
                $("li data-id").val("");
            }
        });
    });
    $(".close").on("click", function() {
        $("#comments-panel").hide();
    })
});