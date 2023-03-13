let previousPage = "home";

function loadPage(pageName) {
  // set the #content element to the page.html file
  $(".loading").show();
  $("#content").load("../html/" + pageName+ ".html");
  $(".loading").hide();
  


  // // change the style of the selected button to .sidebar button-selected and the others to .sidebar button
  // const buttons = document.getElementsByClassName("sidebar-button");
  // // remove the class "button-selected" from only buttons that have it
  
  // for (let i = 0; i < buttons.length; i++) {
  //   buttons[i].classList.remove("button-selected");
  // }
  // const buttonSelected = document.getElementById(pageName);
  // buttonSelected.remove()
  // buttonSelected.classList.add("button-selected");

  const previousButtonSelected = document.getElementById(previousPage);
  previousButtonSelected.classList.remove("sidebar-button-selected");
  previousButtonSelected.classList.add("sidebar-button-unselected");

  const buttonSelected = document.getElementById(pageName);
  buttonSelected.classList.remove("sidebar-button-unselected");
  buttonSelected.classList.add("sidebar-button-selected");

  previousPage = pageName;
  
}



function sidebarListeners() {
  const home = document.getElementById("home");
  const summary = document.getElementById("summary");
  const portfolio = document.getElementById("portfolio");
  const dividends = document.getElementById("dividends");
  const profile = document.getElementById("profile");
  const login = document.getElementById("login");

  home.addEventListener("click", function () { loadPage("home"); });
  summary.addEventListener("click", function () { loadPage("summary"); });
  portfolio.addEventListener("click", function () { loadPage("portfolio"); });
  dividends.addEventListener("click", function () { loadPage("dividends"); });
  profile.addEventListener("click", function () { loadPage("profile"); });
  login.addEventListener("click", function () {
    window.location.replace("../html/login.html");
  });
}

function logoListener() {
  const logo = document.getElementById("logo");
  logo.addEventListener("click", function () { loadPage("home"); });
}

function searchBarListener() {
  const searchBar = document.getElementById("header-search-bar");
  // when typing in the search bar, the search results will be shown
  searchBar.addEventListener("keyup", function () {
    // show again what I did with searchResults.style.display = "none";
    const searchResults = document.getElementById("search-results");
    searchResults.style.display = "block";

    console.log("search bar value: " + searchBar.value);
    const searchedValue = searchBar.value;
    tickerSearch(searchedValue);
  });

  // when click outside the search bar and outside the search results the search results will be hidden
  document.addEventListener("click", function (e) {
    const searchResults = document.getElementById("search-results");
    if (e.target.id != "header-search-bar") {
      searchResults.style.display = "none";
    }
  } );
}


function init() {
  logoListener();
  loadPage("home");
  sidebarListeners();
  searchBarListener()
}

// $(document).ready(function () {

//   init();
// });

init();
// document.addEventListener("DOMContentLoaded", function(event){
//   init();
// });




// window.addEventListener('load', function () {
//   init();
// });


// document.addEventListener('DOMContentLoaded', function () {
//   init();
// });


// ===================
