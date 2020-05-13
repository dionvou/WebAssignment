//jshint esversion:6


var api_url = "http://www.omdbapi.com/";
var key = "400514f3";


let input = document.querySelector('.css-input2');

// Init a timeout variable to be used below
let timeout = null;

input.addEventListener('keyup', function(e) {
  // Clear the timeout if it has already been set.
  // This will prevent the previous task from executing
  // if it has been less than <MILLISECONDS>
  clearTimeout(timeout);

  // Make a new timeout set to go off in 1000ms (1 second)
  timeout = setTimeout(function() {

    $.ajax({
      type: 'GET',
      url: "http://www.omdbapi.com/?s=" + input.value + "&apikey=400514f3",
      async: true,
      success: function(result) {
        dropdown = document.querySelector('.dropdown-content');
        showResults(input.value);
        if (result.Response == "False") {
          dropdown.innerHTML = "Movie not found";
        } else {
          dropdown.innerHTML = "";
          for (let i = 0; i < result.totalResults; i++) {

            dropdown.innerHTML += "<div class='movie'><img src=" + result.Search[i].Poster + "><h3>" + result.Search[i].Title + "</h3><p>" + result.Search[i].Type + "</br>" + result.Search[i].Year + "</br><a href=movie.html>Περισσότερα</a></p><hr></div>";
            if (i == 2) {
              break;
            }
          }
          let ancor = document.querySelectorAll('.movie a');
          for (i = 0; i < ancor.length; i++) {
            ancor[i].addEventListener('click', function(e) {
              localStorage[".movieTitle"] = this.parentElement.parentElement.childNodes[1].innerHTML;
            });
          }
        }
        console.log(result);
      },
      fail: function() {
        console.log("fail");
      }
    });
  }, 500);
});


function showResults(value) {
  let width=document.querySelector(".css-input").getBoundingClientRect().width;
  document.querySelector(".dropdown-content").style.width=width+"px";
  if(value==""){
    document.getElementById("myDropdown").classList.remove("show");
  }else{

    document.getElementById("myDropdown").classList.add("show");

  }
}


window.onload = function () {
  $.ajax({
    type: 'GET',
    url: "http://www.omdbapi.com/?t=" + localStorage[".movieTitle"] + "&apikey=400514f3",
    async: true,
    success: function(result) {
      console.log(result);
      document.querySelector("h1").innerHTML=result.Title;
      document.querySelector(".main img").src=result.Poster;
      document.querySelector(".date").innerHTML=result.Year;
      document.querySelector(".type").innerHTML=result.Type;
      document.querySelector(".writer").innerHTML="Writer:<br> "+result.Writer;
      document.querySelector(".actors").innerHTML="Actors:<br> "+result.Actors;
      document.querySelector(".rating").innerHTML="Imdb Rating:<br>"+result.imdbRating;
      document.querySelector(".plot").innerHTML=result.Plot;
    },
    fail: function() {
      console.log("fail");
    }
  });
};
