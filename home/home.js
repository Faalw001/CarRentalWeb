
$(document).ready(function () {
    loadUserInfo();
    $("#signout").on("click", function () {
      signout();
    });
  })
  
  
  function signout() {
   keycloak.logout({ redirectUri: "http://127.0.0.1:5500/" });
  //  keycloak.logout({ redirectUri: "http://127.0.0.1:5501/" });
  }

  function  loadUserInfo(){
    $("#div1").html(
        "<h1>Account info</h2><be><b1>" +
          // Content in table rows
          '<table class="few-col-table">' +
          "<tr><td>Username: </td><td>" +
          keycloak.tokenParsed.preferred_username +
          "</td></tr>" +
          "<tr><td>User email: </td><td>" +
          keycloak.tokenParsed.email +
          "</td></tr>" +
          "<tr><td>First name: </td><td>" +
          (keycloak.tokenParsed.given_name == ""
            ? "No registered name"
            : keycloak.tokenParsed.given_name) +
          "</td></tr>" +
          "<tr><td>Last name: </td><td>" +
            (keycloak.tokenParsed.family_name == ""
            ? "No registered name"
            : keycloak.tokenParsed.family_name) +
          "</td></tr>" +
          "</td></tr></table>" +
          '<br><a class=" btn1 button button2" id="signout" href="#popup1" style="text-decoration: none" >SignOut</a>'
      );}