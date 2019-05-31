$(document).on("click", "#view-note", function() {

  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Now make an ajax call for the Article
  // $.ajax({
  //   method: "GET",
  //   url: "/articles/" + thisId
  // })
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:3001/articles/" + thisId ,
    "method": "GET",
    
  }
  
  $.ajax(settings).done(function (response) {
    for(var i =0; i < response.note.length; i++) {
    console.log(response.note[i].name);
    console.log(response.note[i].body);
    $("#comments").html("<h6> name: </h6>" + response.note[i].name + "<br><br> <h6>comment:</h6> " + response.note[i].body + "");
    // $("#comments").prepend(response.note[i].body);
    }
  })
    // With that done, add the note information to the page
    // .then(function(data) {
    //   // for(var i = 0;i < data.length; i++){
    //   console.log(data);
    //   // The title of the article
    //   // $("#note-header").text(data.title);
    //   // An input to enter a new title
    //   $("#view-title").html("<p id='name-input'></p>");
    //   // A textarea to add a new note body
    //   $("#view-body").html("<p id='body-input'></p");
    //   // A button to submit a new note, with the id of the article saved to it
    //   // $("#save-note-btn").html("<p data-id='" + data._id + "' id='save-note' class='list-button'>Save Note</p>");
    //   $("#view-note-btn").html("<p data-id='" + data._id + "' id='close' class='list-button'>close</p>");

    //   // If there's a note in the article
    //   if (data.note) {
    //     console.log(data)
    // }
    // });
});

$(document).on("click", "#new-note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#note-header").text(data.title);
      // An input to enter a new title
      $("#note-title").html("<input id='name-input' name='name' >");
      // A textarea to add a new note body
      $("#note-body").html("<textarea id='body-input' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#save-note-btn").html("<p data-id='" + data._id + "' id='save-note' class='list-button'>Save Note</p>");
      $("#close-note-btn").html("<p data-id='" + data._id + "' id='close' class='list-button'>close</p>");
      // $("#delete-note-btn").html("<p data-id='" + data._id + "' id='delete-note' class='list-button'>Delete</p>");

      // If there's a note in the article
      if (data.note) {
        $("#name-input").val(data.note.name);
        $("#body-input").val(data.note.body);
      }
    });
});

$(document).on("click", "#save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  var newNote = {
    name: $("#name-input").val(),
    // Value taken from note textarea
    body: $("#body-input").val()
  };

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: newNote
  })
    // With that done
    .then(function(data) {
      // Log the response
      // console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#name-input").val("");
  $("#body-input").val("");
});

$(document).on("click", "#delete-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  })
    
    .then(function(data) {
      console.log(thisId + "deleted")
  
    });
});

$(document).on("click", "#close", function() {
  $("#notes").empty();

})


