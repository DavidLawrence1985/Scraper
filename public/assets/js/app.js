    // Whenever someone clicks a p tag
$(document).on("click", ".summary", function() {
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
      $("#notes").append("<h2>" + data.name + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='name-input' name='name' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='body-input' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='save-note'>Save Note</button>");

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
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#name-input").val("");
  $("#body-input").val("");
});
