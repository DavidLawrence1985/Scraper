
$(document).on("click", "#view-note", function() {
  $("#view-comments").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/articles/" + thisId ,
    "method": "GET",  
  }
  
  $.ajax(settings).then(function (response) {
    for(var i =0; i < response.note.length; i++) {
      var noteName = response.note[i].name;
      var noteBody = response.note[i].body;
      var noteId = response.note[i]._id;
      console.log(noteName + " note name");
      console.log(noteBody + " note body");
      console.log(noteId + " note id");
      var commentDiv = $("<div>");
      commentDiv.addClass("comment-div");
      var name = $("<h3>").text("Name: " + noteName);
      var body = $("<p>").text("Comment: " + noteBody);
      var deleteButton = $("<P>").text("Delete");
      deleteButton.attr("data-id", noteId);
      deleteButton.attr("id", "delete-comment");
      deleteButton.attr("data-dismiss", "modal");
      deleteButton.attr("data-target", "#view-note-modal")
      deleteButton.attr("data-toggle", "modal")
      deleteButton.attr("data-target", "#delete-alert")
      deleteButton.attr("class", "btn btn-danger");
      name.addClass("comment-name");
      body.addClass("comment-body");

    //add data to modal
      $("#view-comments").prepend(commentDiv)
      commentDiv.prepend(deleteButton);
      commentDiv.prepend(body);
      commentDiv.prepend(name);
     
    }
  })

});

$(document).on("click", "#new-note", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function(data) {
      console.log(data);
      $("#note-header").text(data.title);
      // An input to enter a new title
      $("#note-title").html("<input id='name-input' name='name' >");
      // A textarea to add a new note body
      $("#note-body").html("<textarea id='body-input' name='body'></textarea>");
      $("#save-note-btn").html("<p data-id='" + data._id + "' id='save-note' class='btn btn-success' data-toggle='modal' data-target='#create-note-modal'>Add</p>");
      $("#close-note-btn").html("<p data-id='" + data._id + "' id='close' class='btn btn-danger'>close</p>");
    
    });
});

$(document).on("click", "#save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  var newNote = {
    name: $("#name-input").val(),
    // Value taken from note textareaf
    body: $("#body-input").val()
  };

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: newNote
  })
    .then(function(data) {
      $("#notes").empty();
      
    });

  $("#name-input").val("");
  $("#body-input").val("");
});

$(document).on("click", "#delete-comment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  })
    
    .then(function(data) {
      console.log(thisId + " deleted");
  
  });
});

$(document).on("click", "#close", function() {
  $("#notes").empty();

});
