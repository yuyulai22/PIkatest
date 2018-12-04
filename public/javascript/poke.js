// document.getElementById('pokeBut').addEventListener('click', findPoke);
//document.getElementById('pokeBut').addEventListener('click', displayAllGroup);

var myData;
function getEgg() {
    var selEgg = document.getElementById('egggroup');
    var selEggVal = selEgg.options[selEgg.selectedIndex].value;
    var selEggText = selEgg.options[selEgg.selectedIndex].text;
    document.getElementById('eggname').innerHTML = selEggText + ' group';
    console.log(selEggVal);
    return selEggVal;
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

function displayAllGroup() {
    console.log("displaygroup");
    document.getElementById('display').innerHTML = '';
    var eggroup = getEgg();
    var data = getData('http://pokeapi.co/api/v2/egg-group/' + eggroup);
    var group = data.pokemon_species;
    for (var i = 0; i <= group.length - 1; i++) {
        displayPokemon(group[i],i+1,group.length);
    }
}

function changeText(text) {
    console.log(text, ' has been pressed');
}

function displayPokemon(pokemon, count, total) {
    console.log(count + '/' + total);
    var tempData = getData(pokemon.url);
    var newurl = tempData.varieties[0].pokemon.url;
    var data = getData(newurl);
    var name = tempData.name;
    var formatted_name = name.charAt(0).toUpperCase() + name.slice(1);
    var sprite = data.sprites.front_default;

    // each pokemon in div called pokeDisplay
    var div = document.createElement("DIV");
    var onclick = div.getAttribute("onclick");
    div.setAttribute("id", "pokeDisplay");

    // name of pokemon
    var para = document.createElement("p");
    var text = document.createTextNode(formatted_name);
    para.appendChild(text);
    para.setAttribute("id", "pokePara");

    div.onclick = function() {
        changeText(name);
        document.getElementById('regisButt').style.display = 'block';
        document.getElementById('pokeName').innerHTML = name;
    };

    // image 
    var img = document.createElement("img");
    //making poke display clickable 

    img.setAttribute("id", "pokeImg");
    img.setAttribute("src", sprite);
    div.appendChild(img);
    div.appendChild(para);
    document.getElementById("display").appendChild(div);
}

var pokeList = [];

document.getElementById("regisButt").addEventListener("click", function(){
    var entry = document.getElementById("pokeName").innerHTML;
    console.log('entry is', entry);
    pokeList.push(entry);
    var data = {
        pokemonname: entry
    };
      $.ajax({
            type: "POST",
            url: '/save',
            data: data,
            dataType: "json",
            success: function(data, textStatus) {
                console.log(data);
                if (data.redirect) {
                    // data.redirect contains the string URL to redirect to
                    window.location.href = data.redirect;
                }
                else {
                    // data.form contains the HTML for the replacement form
                    // $("#myform").replaceWith(data.form);
                    console.log('ajax did not work')
        }
    }
}); 
});



