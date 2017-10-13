$.getJSON("/articles", function(data) {
    console.log("Hi-ya");
    $(".article-container").empty();
    for (var i = 0; i < 20; i++) {
        $(".article-container").append(
            '<div class = "panel panel-primary panel-article" data-id="' + data[i]._id + '">' +
            '<div class= "panel-title">' +
            "<a href= '" + data[i].link +
            "'><h3>" + data[i].title +
            "</h3></a><div class = 'btn btn-success save'> Save Article</div>" + '<div class = "panel-body"><h5>' +
            data[i].summary +
            "</h5></div>" + "</div>");
    }
});
$(document).ready(function() {

    $(".scrape-new").on("click", function() {
        console.log("hi");
        $(".article-container").empty();
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
        console.log(this);
        var articleId = $(this).attr("data-id");
        console.log(articleId);
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).done(function(data) {
            console.log(data);
            $("#comments-panel").show();
            $("#comments-new").empty();
            $("#comment-new").append('<div class="row">' +
                '<div class="col-xs-12"><div class="form-group">' +
                '<label for="bodyinput" class="col-lg-2 control-label">' +
                'Comment</label><div class="col-lg-8"><input type="text"' +
                'class="form-control" id="bodyinput" placeholder="Comment">' +
                '</div><div class="col-lg-2"><div class="btn btn-info btn-block"' +
                'data-id=' + data._id + ' id="savenote">Save</div></div></div></div></div>');



            if (data.comments) {
                // Place the body of the note in the body textarea
                for (var i = 0; i < data.comments.length; i++) {
                    $("#comments").append('<li>- ' + data.comments[i].body + '</li>');
                }
            }
        });
    });


    $("#savenote").on("click", function() {
        var articleId = $(this).attr("data-id");
        console.log("test");
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: $("#bodyinput").val()
            }
        }).done(function(data) {
            console.log(data);
        });
        $("#comments").append("<li>- " + ("#bodyinput").val() + "</li>");
        $("#bodyinput").val("");
    });
});