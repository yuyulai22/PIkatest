var matchbtn = document.getElementById('matchbtn')

matchbtn.addEventListener('click', function(){
    //Function for 'getusers' button.
    document.getElementById('resultArea').innerHTML = '';
    return getUserList().then(getCurrentUser());
    
})

function getUserList(){
    return $.ajax({
            type: "GET",
            url: "/userList",
            success: function(res) {
                console.log("res userlist is", res);
                getEgg(res);
            }
});
}

//get current user and assign to CurrUser
var currUser = null;
function getCurrentUser(){
       return $.ajax({
            type: "GET",
            url: "/currentUser",
            success: function(res) {
                console.log("res cur user is", res);  
                currUser = res; 
                matchUsers(currUser);  
            }
        });
}


var eggdict = {}
var pokedict = {}

//get egg groups of all the users' pokemons
function getEgg(pokelist) {
   for (var prop in pokelist) {
        username = prop;
        userpoke = pokelist[prop];
        var data = getData('https://pokeapi.co/api/v2/pokemon/' + userpoke +'/');
        var group = Object.values(data)[12];
        var species = Object.values(group)[1];
        var eggdata = getData(species);
        var egg = eggdata["egg_groups"];
        var getegggroup = Object.values(egg)[0];
        var getgetegggroup = Object.values(getegggroup)[0]

        console.log(username + " = " + userpoke + " belongs to " + getgetegggroup);
        // getPic(userpoke, username);
        pokedict = pokelist
        console.log(pokedict);
        eggdict[username] = getgetegggroup
    }

    return eggdict;
}

//match users if in the same egg group
function matchUsers(currUser){
    var currentUserEgg;
    var userCount = 0;
    console.log("eggdict is", eggdict);
    for (var key in eggdict) {
      if (key == currUser){
        currentUserEgg = eggdict[key];
      }
    }

    console.log('current user ', currUser, " is in egg group ", currentUserEgg);
    console.log("pokedict is ", pokedict);

    var groups = Object.keys(eggdict);
    console.log("groups", groups);
    var values = Object.values(eggdict);
    console.log("values", values);
    for (var i = 0; i < groups.length; i++) {
        console.log(values[i], values[i] == currentUserEgg);
        if (values[i] == currentUserEgg || currentUserEgg == "ditto" || values[i] == "ditto"){
            matchedUser = groups[i];
            console.log("users who matched are ", matchedUser)
            matchedUserPoke = pokedict[matchedUser]
            console.log('match:' + matchedUserPoke + 'curr:' + currUser)
            if (matchedUser != currUser) {
                getPic(matchedUserPoke, matchedUser);
                userCount++
            }
            
        }
    }
    if (userCount == 0) {
        noUsersFound()
    }
}

function noUsersFound() {
    var div = document.createElement("DIV");
    var para = document.createElement("p");
    var text = document.createTextNode("No matches found, sorry.");
    para.appendChild(text);
    div.setAttribute("id", "matchDisplay");
    div.appendChild(para);
    document.getElementById("resultArea").appendChild(div);
}

function getData(link) {

    return ($.ajax({
        url: link,
        dataType: 'json',
        async: false,
        success: function(data) {
            return data;
        }
    })).responseJSON;
}

//get pokemon pic for each user
function getPic(poke, username){
    var pic = getData("https://pokeapi.co/api/v2/pokemon/" + poke +"/");
     var sprite = pic["sprites"];
     var spritesprite = Object.values(sprite)[4];
     stringsprite = String(spritesprite);
    //making poke display clickable 
    var div = document.createElement("DIV");
    var img = document.createElement("img");
    var para = document.createElement("p");
    var formatted_name = username.charAt(0).toUpperCase() + username.slice(1);
    var text = document.createTextNode(formatted_name);

    var button = document.createElement('BUTTON');
    button.setAttribute('id', "matchButton");
    button.setAttribute('class', "btn btn-info");
    button.innerHTML = ("Click here to chat with " + formatted_name);

    button.onclick = function(){
        console.log('woaaaa hi');

        $.ajax({
            type: "POST",
            url: '/chat',
            data: username,
           success: function(data, textStatus) {
                console.log(data);
                if (data.redirect) {
                    // data.redirect contains the string URL to redirect to
                    window.location.href = data.redirect;
                }else{
                    console.log('boo')
                }
        }
        });
    }

    para.appendChild(text);
    div.setAttribute("id", "matchDisplay");

    img.setAttribute("id", "pokeImg");
    img.setAttribute("src", stringsprite);
    div.appendChild(img);
    div.appendChild(para);
    div.appendChild(button);

    document.getElementById("resultArea").append(div);

}
