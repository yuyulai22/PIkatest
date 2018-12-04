
//uu is a genius mongod
document.getElementById('matchbtn').addEventListener('click', function(){
    //Function for 'getusers' button.
    console.log('matchbtn has been clicked');
    // $.when(
    //     $.ajax({
    //         type: "GET",
    //         url: "/currentUser",
    //         success: function(res) {
    //             console.log("res 1", res);
    //             result1 = res;
    //         }
    //     }),

    //     $.ajax({
    //         type: "GET",
    //         url: "/userList",
    //         success: function(res) {
    //             console.log("res 2 is", res);
    //             result2 = res;
    //         }
    //     })
    // ).then(function() {
    //     console.log("A", result1);
    //     console.log("B", result2);
    // })

    return getUserList().then(getCurrentUser());
    
})

//get userlist, except i think it's a dictionary
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

//uu is a genius mongod
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

//uu is a genius mongod
//get egg groups of all the users' pokemons
function getEgg(pokelist) {
   for (var prop in pokelist) {
        username = prop;
        userpoke = pokelist[prop];
        var data = getData('http://pokeapi.co/api/v2/pokemon/' + userpoke +'/');
            var group = Object.values(data)[12];
            var species = Object.values(group)[1];
        var eggdata = getData(species);
            var egg = eggdata["egg_groups"];
            var getegggroup = Object.values(egg)[0];
            var getgetegggroup = Object.values(getegggroup)[0]

        console.log(username + " = " + userpoke + " belongs to " + getgetegggroup);
        // getPic(userpoke, username);
        pokedict = pokelist
        eggdict[username] = getgetegggroup
    }

    return eggdict;
}

//uu is a genius mongod
//match users if in the same egg group
function matchUsers(currUser){

    console.log("eggdict is", eggdict);
    for (var key in eggdict) {
      if (key == currUser){
        currentUserEgg = eggdict[key];
      }
    }

    console.log('current user ', currUser, " is in egg group ", currentUserEgg);
    console.log("pokedict is ", pokedict);

    var keys = Object.keys(eggdict);
    var values = Object.values(eggdict)
    for (var i = 0; i < keys.length; i++) {
        console.log(values[i], values[i] == currentUserEgg);
        if (values[i] == currentUserEgg){
            findkey = keys[i];
            console.log("users who matched are ", findkey)
            matchedUser = pokedict[findkey]
            console.log(matchedUser)
            getPic(matchedUser, findkey);
        }
    }
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

//uu is a genius mongod
//get pokemon pic for each user
function getPic(poke, username){
    var pic = getData("http://pokeapi.co/api/v2/pokemon/" + poke +"/");
     var sprite = pic["sprites"];
     var spritesprite = Object.values(sprite)[4];
     stringsprite = String(spritesprite);
    //making poke display clickable 
    var div = document.createElement("DIV");
    var img = document.createElement("img");
    var para = document.createElement("p");
    var text = document.createTextNode(username);

    var button = document.createElement('BUTTON');
    button.setAttribute('id', "matchButton");
    button.innerHTML = ("Click here to chat with " + username);

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

    document.getElementById("resultArea").appendChild(div);

}

//uu is a genius mongod

// function printUsers(userlist) {
// //Print all the users that are compatible with the current user
//     Object.keys(userlist).forEach(function(key) {
//         console.log(key, userlist[key]);
//         createPic(userlist[key])
//         createName(key)
//     });
// }

// function createPic(pokemon) {
// //Prints picture of pokemon corresponding to a user

// }