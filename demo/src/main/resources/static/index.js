//jshint esversion:6

var api_url = "http://www.omdbapi.com/";
var key = "400514f3";
// Get the input box
let input = document.querySelector('.css-input2');

// Init a timeout variable to be used below
let timeout = null;

// Listen for keystroke events
input.addEventListener('keyup', function(e) {
  // Clear the timeout if it has already been set.
  // This will prevent the previous task from executing
  // if it has been less than <MILLISECONDS>
  clearTimeout(timeout);

  // Make a new timeout set to go off in 1000ms (1 second)
  timeout = setTimeout(function() {
    $.ajax({
      type: 'GET',
      url: "http://www.omdbapi.com/?s=" + input.value + "&apikey=" + key,
      async: true,
      success: function(result) {
        dropdown = document.querySelector('.dropdown-content');
        showResults(input.value);
        if (result.Response == "False") {
          dropdown.innerHTML = "Movie not found";
        } else {
          dropdown.innerHTML = "";
          //bulding movie rows
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
      },
      fail: function() {

      }
    });
  }, 500);
});

//drop down meny to display movies
function showResults(value) {
  let width = document.querySelector(".css-input").getBoundingClientRect().width;
  document.querySelector(".dropdown-content").style.width = width + "px";
  if (value == "") {
    document.getElementById("myDropdown").classList.remove("show");
  } else {

    document.getElementById("myDropdown").classList.add("show");

  }
}


//reads the path name of the window
var p = window.location.pathname;

//runs on index.html
if (p.slice(-10) === 'index.html') {
  sessionStorage.setItem('status', 'loggedOut');
  sessionStorage.setItem('user', "");
  localStorage[".movieTitle"]="";
  console.log(sessionStorage.getItem('status'));
}

//runs in register.html
if (p.slice(-13) === "register.html") {
  var button = document.querySelector(".login-register");
  button.addEventListener("click", function() {
    let username = document.querySelector(".username").value;
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;
    console.log(username + email + password);
    if (username == "" || email == "" || password == "") {
      let message=document.querySelector("form p");
      message.style.display="block";
      message.innerHTML="*Please fill in the gaps";
      message.style.color="red";
      message.style.fontSize="14px";
      message.style.fontWeight="bold";
    }else if (!email.includes("@")){
      let message=document.querySelector("form p");
      message.style.display="block";
      message.innerHTML="*Enter a valid email";
      message.style.color="red";
      message.style.fontSize="14px";
      message.style.fontWeight="bold";
    }else {
      var objectData = {
        username: username,
        email: email,
        password: password
      };
      var objectDataString = JSON.stringify(objectData);
      $.ajax({
        type: 'POST',
        url: "http://localhost:3000/users",
        contentType: "application/json; charset=utf-8",
        data: objectDataString,
        success: function() {
          console.log(objectDataString);
        },
        error: function() {
          let message=document.querySelector("form p");
          message.style.display="block";
          message.innerHTML="*Username is already used";
          message.style.color="red";
          message.style.fontSize="14px";
          message.style.fontWeight="bold";
        }
      });
    }
  });
}


//runs in login.html
if (p.slice(-10) === "login.html") {
  var button = document.querySelector(".login-register");
  button.addEventListener("click", function() {
    let username = document.querySelector(".username").value;
    let password = document.querySelector(".password").value;
    if (username == "" || password == "") {
      let message=document.querySelector("form p");
      message.style.display="block";
      message.innerHTML="*Please fill in the gaps";
      message.style.color="red";
      message.style.fontSize="14px";
      message.style.fontWeight="bold";
    } else {
      var objectData = {
        username: username,
        password: password
      };
      var objectDataString = JSON.stringify(objectData);
      $.ajax({
        type: 'PUT',
        url: "http://localhost:3000/users/" + username,
        contentType: "application/json; charset=utf-8",
        data: objectDataString,
        success: function(data) {
          if(data==true){//your account exist and you log in
            sessionStorage.setItem('status', 'loggedIn');
            sessionStorage.setItem('user', username);
            window.location.replace("user.html");
          }else{
            let message=document.querySelector("form p");
            message.style.display="block";
            message.innerHTML="*Username or password are not valid";
            message.style.color="red";
            message.style.fontSize="14px";
            message.style.fontWeight="bold";
          }

        }
      });
    }
  });
}



//runs in movie.html
if (p.slice(-10) === "movie.html") {
  if (sessionStorage.getItem('status') == "loggedIn") { //load the loggedIn nav-bar when the user is logged in
    document.querySelector(".a1").href = "user.html";
    document.querySelector(".a2").href = "mybookmarks.html";
    document.querySelector(".a2").innerHTML = "My Movies";
    document.querySelector(".a3").href = "index.html";
    document.querySelector(".a3").innerHTML = "Logout";
  }

  $.ajax({
    type: 'GET',
    url: "http://www.omdbapi.com/?t=" + localStorage[".movieTitle"] + "&apikey=400514f3",
    async: true,
    success: function(result) {
      // console.log(result);
      document.querySelector(".title").innerHTML = "<h1>" + result.Title + "</h1><img class='bookmarkicon' src='images/bookmarkoff.png' width='5%' >";
      document.querySelector(".img img").src = result.Poster;
      document.querySelector(".date").innerHTML = result.Year;
      document.querySelector(".type").innerHTML = result.Type;
      document.querySelector(".writer").innerHTML = "Writer:<br> " + result.Writer;
      document.querySelector(".actors").innerHTML = "Actors:<br> " + result.Actors;
      document.querySelector(".rating").innerHTML = "Imdb Rating:<br>" + result.imdbRating;
      document.querySelector(".plot").innerHTML = result.Plot;


      let icon = document.querySelector(".bookmarkicon");
      if(sessionStorage.getItem('status')=="loggedIn"){
        $.ajax({ // to see if this movie is already bookmarked
          type: 'GET',
          url: "http://localhost:3000/" + sessionStorage.getItem('user') + "/movies/" + icon.parentElement.childNodes[0].innerHTML,
          async: true,
          success: function(result) {
            if (result == true) { //this is already bookmarked
              icon.src = 'images/bookmarkon.png';
            }

          },
          fail: function() {

          }
        });
      }



      icon.addEventListener('click', function(e) {
        if (sessionStorage.getItem('status') == 'loggedIn') {
          if (icon.src.slice(-15) == "bookmarkoff.png") {
            icon.src = "images/bookmarkon.png";
            $.ajax({
              type: 'POST',
              url: "http://localhost:3000/" + sessionStorage.getItem('user') + "/movies/" + icon.parentElement.childNodes[0].innerHTML,
              async: true,
              success: function(result) {
                if (result == true) { //deleted from database successfully
                  alert("The movie has been added to your bookmarks");
                }

              },
              fail: function() {

              }
            });
          } else { //delete movie from bookmarks
            icon.src = "images/bookmarkoff.png";
            $.ajax({
              type: 'DELETE',
              url: "http://localhost:3000/" + sessionStorage.getItem('user') + "/movies/" + icon.parentElement.childNodes[0].innerHTML,
              async: true,
              success: function(result) {
                if (result == true) { //deleted from database successfully
                  alert("The movie has been deleted from your bookmarks");
                }

              },
              fail: function() {
                alert("not ok");
              }
            });
          }
        }
      });
    },
    fail: function() {
      console.log("fail");
    }
  });
}

//runs in Bookmarks.html
if (p.slice(-16) === "mybookmarks.html") {


  $.ajax({
    type: 'GET',
    url: "http://localhost:3000/" + sessionStorage.getItem('user') + "/movies",
    async: true,
    success: function(data) { //the user have not saved movies yet
      if(data.length==0){
        document.querySelector(".main").innerHTML = "<h1>You have not saved any movie yet</h1>"
        let h1=document.querySelector(".main h1");
        h1.style.padding="30%";
        console.log(data);
      }
      for (i = 0; i < data.length; i++) {
        $.ajax({
          type: 'GET',
          url: "http://www.omdbapi.com/?t=" + data[i] + "&apikey=400514f3",
          async: true,
          success: function(result) {
            console.log(result);
            document.querySelector(".main").innerHTML += "<div class='mybookmarks'><div class='poster'><img class='deleteicon' src='images/deleteicon.png'></img><img src=" + result.Poster + "></div><h3>" + result.Title + "</h3><p>" + result.Type + "</br></br>" + result.Year + "</br></br><a class='perissotera' href=movie.html>Περισσότερα</a></p><hr></div>";



            // περισσότερα saves movie title to localStorage
            let ancor = document.querySelectorAll('.perissotera');
            for (i = 0; i < ancor.length; i++) {
              ancor[i].addEventListener('click', function(e) {
                localStorage[".movieTitle"] = this.parentElement.parentElement.childNodes[1].innerHTML;

              });
            }

            //deleteicon implementation
            let btn = document.querySelectorAll(".deleteicon");
            for (let i = 0; i < btn.length; i++) {
              btn[i].addEventListener('click', function() {
                $.ajax({
                  type: 'DELETE',
                  url: "http://localhost:3000/" + sessionStorage.getItem('user') + "/movies/" + btn[i].parentElement.parentElement.childNodes[1].innerHTML,
                  async: true,
                  success: function(result) {
                    window.location.reload();
                  },
                  fail: function() {

                  }
                });
              });
            }

          },
          fail: function() {

          }
        });
      }
    },
    fail: function() {

    }
  });
}


//runs in user.html
if (p.slice(-9) === "user.html") {
  document.querySelector(".main h1").innerHTML = "Welcome to World Cinema " + sessionStorage.getItem('user');
  document.querySelector(".main p").innerHTML = "Find any movie in this platform and save your favorite ones!";
}
