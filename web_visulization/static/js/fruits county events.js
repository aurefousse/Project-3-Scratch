function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

//function for dropdown menu and initial graphs 
function init() {
    d3.json('/data/fruits').then((data) => {
        //select the dropdown.
        var menu = d3.select("#selDataset");
        //var uniqueState = states.filter(onlyUnique);
        var crops = []
        for (let i = 0; i < data.length; i++) {
            c = data[i].Commodity
            crops.push(c);
        }
        //states.filter(onlyUnique)
        var uniqueCrops = crops.filter(onlyUnique)
        uniqueCrops.forEach((crop) => {
            menu.append("option").text(crop).property("value", crop);
        });
        //creating function for initial plots 
        var initSample = uniqueCrops[0]
        createMap(initSample);
    })
};

function createMap(commodity) {
    //removing map if already exist
    var container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
}
    // Create a map object.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });
    // Define a markerSize() function that will give each city a different radius based on its population.
    // function markerSize(value) {
    //     return value/100;
    // }

    // Add a tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
    // Working on data rendering

    // setting color for each sales range
    function chooseColor(Value) {
        if (Value >= 1000000) return "red";
        else if (Value >= 500000) return "orange";
        else if (Value >= 250000) return "yellow";
        else if (Value >= 100000) return "green";
        else if (Value >= 10000) return "white";
        else return "black";
      }

      // adding the county boundaries layer
    var Counties_json = '/Users/aurelianfousse/Desktop/UCSD Bootcamp/Projects/Project 3/us-agriculture scratch/data analysis/data/us-county.geojson'

    d3.json(Counties_json, function(response) {
        L.geoJson(response, {
    // Styling each feature, in this case, a county
        style: function(feature) {
            return {
                color: "white",
                fillColor: "blue",
                fillOpacity: 0.25,
                weight: 1.5
            };
        },
        onEachFeature: function(feature, layer) {
            // Set the mouse events to change the map styling.
            layer.on({
              // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
              mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.7
                });
              },
              // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
              mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.25
                });
              },
              // When a feature (neighborhood) is clicked, it enlarges to fit the screen.
              click: function(event) {
                myMap.fitBounds(event.target.getBounds());
              }
            });
            layer.bindPopup(`<h1>${d.County},${d.State}</h1>  <hr> <h3>Total Sales:$ ${d.Value.toLocaleString()}</h3>`)
        }.addTo(myMap)
    });
});

function optionChanged(newSample) {
        createMap(newSample);
}
        init();
// d3.json('/data/fruits').then((data) => {
//     // creating marker clusters
//     for (var i = 0; i < data.length; i++) {
//         var d = data[i]


// if (d.Commodity == commodity) {

//     // Setting the marker 
//     markers.addLayer(L.circle([d.Lat, d.Lon], {
    
//     }).bindPopup(`<h1>${d.County},${d.State}</h1>  <hr> <h3>Total Sales:$ ${d.Value.toLocaleString()}</h3>`))
//         .addTo(myMap);
// }
// }
// });


