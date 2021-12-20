// declare variables
var map = document.querySelector("#map");
var input = document.querySelector("#search");
let coordinates = JSON.parse(localStorage.getItem("brewcord")) || [];
let history = JSON.parse(localStorage.getItem("search-history")) || [];
// var breweryLocation = 'Vashon,WA';
var tableContainer = document.querySelector("#brewery-table");
// var mapBtn = document.querySelector(".map-btn");


input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      localStorage.removeItem("brewcord");
      coordinates = [];
      formSubmit(event);
    }
  });


function formSubmit(event) {
    event.preventDefault();
    var cityName = input.value;
    generateBreweryData(cityName);
    history.push(cityName);
    localStorage.setItem("search-history", JSON.stringify(history));
    console.log(cityName);
    input.value = "";
  }


function generateBreweryData (cityName) {
    tableContainer.innerHTML = "";
    console.log(cityName);

    // cityName = "Vashon";

    var brewRequestURL = "https://api.openbrewerydb.org/breweries?by_city=" + cityName;

    fetch(brewRequestURL)
    .then(function (response) {
        console.log(response);
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);


        // for loop to create table elements
        for (let i =0; i < data.length; i++) {

            var rowEl = document.createElement('tr');
            tableContainer.append(rowEl);

            var rowContent = document.createElement('td');
            // rowContent.classList.add("col s8");
            rowEl.append(rowContent);

            var brewName = document.createElement('p');
            brewName.classList.add("brew-name");
            brewName.textContent = data[i].name + " [" + data[i].brewery_type + "]" ;

            var breweryAddress = document.createElement('p');
            var addressFull = "";
            
            if (data[i].street) {
              addressFull += data[i].street + " " + data[i].city + ", " + data[i].state + " " + data[i].postal_code;
            }
            else {
              rowEl.remove();
            }

            if(data[i].brewery_type==="closed") {
                rowEl.remove();
            }

            breweryAddress.textContent = addressFull;

            var brewWebsite = document.createElement('a');
            brewWebsite.classList.add("brew-website");
            brewWebsite.href = data[i].website_url;
            brewWebsite.textContent = data[i].website_url;

            var buttonContainer = document.createElement('td');
            buttonContainer.classList.add ("mapbtn-container");
            // rowContent.classList.add("col s4");
            
            var buttonValue = data[i].latitude + "," + data[i].longitude;
            // console.log(buttonValue);

            coordinates.push(buttonValue);
            localStorage.setItem("brewcord", JSON.stringify(coordinates));
            console.log(coordinates);

                // buttons to view the brewery on a map
                const mapButton = document.createElement('button');
                mapButton.className = " map-btn btn waves-effect grey darken-4";
                mapButton.setAttribute("type", "submit");
                mapButton.textContent = "Map it!";
                mapButton.setAttribute("value", coordinates[i]);
                // mapButton.setAttribute("data-cord", buttonValue);
                // console.log(mapButton.dataset.cord);
                // icon on the map buttons
                var btnIcon = document.createElement("i");
                btnIcon.className = "material-icons left";
                btnIcon.textContent = "location_searching";
                mapButton.append(btnIcon);
      
                buttonContainer.append(mapButton);
                // const mapBtn = document.querySelector(".map-btn");
                mapButton.addEventListener("click", event => {
                    console.log(event.target.value);
                    generateMap(event.target.value);
                })
          
            
            rowEl.append(rowContent, buttonContainer);
            rowContent.append(brewName, breweryAddress, brewWebsite);

            // mapButton.addEventListener("click",function() {
            //     map.src="";
            //     var mapRequestURL = 'https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=300x200&scale=1&maptype=roadmap&markers=size%3Alrg%7Ccolor%3Ablack%7C' + mapButton.value + '&center=' + mapButton.value + 'key=AIzaSyBPtCzgyimy69Svl3-LRgwO47gFXn8XAyI';
            //     console.log(mapRequestURL);
            //     map.src = mapRequestURL;
            //     // generateMap(mapButton.value);
            // })

        }

        })
    }
    })
}



// generateBreweryData();



function generateMap (breweryLocation) {
    console.log(breweryLocation);
    var mapRequestURL = 'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=250x250&scale=2&maptype=roadmap&markers=size%3Alrg%7Ccolor%3Ablack%7C' + breweryLocation + '&center=' + breweryLocation + '&key=AIzaSyBPtCzgyimy69Svl3-LRgwO47gFXn8XAyI';
    console.log(mapRequestURL);
    map.src = mapRequestURL;
    
}

// mapBtn.addEventListener("submit", event => {
//     console.log(event.target.value);
//     generateMap(event.target.value);
// })

