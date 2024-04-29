//Check if the user has consented, if no display the consent banner
function checkConsent(){
    var consent = document.getElementById('cookie');
    if(localStorage.getItem("consent")){
        consent.style.display = 'none';
    }
}

checkConsent();

// DECLARE THE BASE PATH OF THE API
const basePath = "http://localhost:3000/"

// IMPORT ALL THE NEEDED DOM ELEMENTS

const login = document.getElementById("login");
const planLinks = document.getElementsByClassName("plan")[0];
const roomContainer = document.getElementById("rooms");
const accomodationConatiner = document.getElementById("accomodation");


//THIS ARE ALL THE FUNCTIONS THAT DEAL WITH ROUTING

//routeLoginpage opens up the login page

function routeLoginPage(){
    window.location.href = "login.html";
}

//routeHomePage opens up the home page

function routeHomePage(){
    window.location.href = "index.html"
}

//routeTeamPage opens up the team page

function routeTeamPage(){
    window.location.href = "team.html"
}

//Routes to support page
function routeSupportPage(){
    window.location.href = "support.html"
}

//routes to dashboard
function routeDashboard(){
    window.location.href = "dashboard.html"
}

//routes to rooms page
function routeRooms(){
    window.location.href = "room.html"
}

//Used to clear the users information and log out
function logOut(){
    sessionStorage.removeItem("user");
    routeHomePage();
    console.log('test')
}


//THIS IS USED TO MANIPULATE THE VIEW DEPENDING ON IF THE USER IS LOGGED IN OR NOT
const logged = document.getElementsByClassName('logged')[0];
const notLogged = document.getElementsByClassName('not-logged')[0];
if(!sessionStorage.getItem("user")){
   logged.style.display = 'none';
   notLogged.style.display = 'block';
}else{
    logged.style.display = 'block';
    notLogged.style.display = 'none';
}

//This is used to confirm that the user has consented to the application using cookies
function confirmCookies(){
    localStorage.setItem("consent", 'true');
    console.log(localStorage.getItem("consent"))
    checkConsent();
}

//togglePlan is used to hide and display the drop down of the plan section
function togglePlan(){
    if(planLinks.style.display == "none" || planLinks.style.display == ""){
        planLinks.style.display = "block";
    }else{
        planLinks.style.display = "none";
    }
}

function forgotPassword(){
    alert("Please head over to our contact us page, so we can provide you with any needed assistance");
}

