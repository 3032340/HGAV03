// leaflet kaart

var map = L.map('leafletmap').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let mijnGeojsonLaag = L.geoJSON().addTo(map); 

let woonplaatsen = ['Amersfoort','soesterberg','almere']
let woonplaatsNaam = woonplaatsen[2]

fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${woonplaatsNaam}&rows=10`)
    .then(response => response.json())
    .then (data => {

        console.log(data.response.docs[0].id);
        let id = data.response.docs[0].id

        tekenDataOpKaart (id);
    } )

    function tekenDataOpKaart(woonplaatsId){
        const mijnEersteAPIrequest = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=${woonplaatsId}&wt=json&fl=*`

        fetch(mijnEersteAPIrequest, {})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(data.response.docs[0].geometrie_ll)
        document.getElementById("gemeentetekst").innerHTML = data.response.docs[0].weergavenaam;
        
        let geojsonFeature = Terraformer.wktToGeoJSON(data.response.docs[0].geometrie_ll);
        mijnGeojsonLaag.addData(geojsonFeature);
        
        let centerCoordinates = Terraformer.wktToGeoJSON(data.response.docs[0].centroide_ll);
        console.log(centerCoordinates);
        map.flyTo(centerCoordinates.coordinates.reverse());

        } )
    }


const mijnEersteAPIrequest = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=wpl-f8c939d8ba340bb0094e294fb6ddfe39&wt=json&fl=*'

fetch(mijnEersteAPIrequest, {})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(data.response.docs[0].geometrie_ll)
        
        let geojsonFeature = Terraformer.wktToGeoJSON(data.response.docs[0].geometrie_ll);
        mijnGeojsonLaag.addData(geojsonFeature);
        
        let centerCoordinates = Terraformer.wktToGeoJSON(data.response.docs[0].centroide_ll);
        console.log(centerCoordinates);
        map.flyTo(centerCoordinates.coordinates.reverse());

        } )

       //Arcgis kaart//

    require(["esri/config", "esri/Map", "esri/views/MapView"], function (esriConfig, Map, MapView){
        
        esriConfig.apiKey = "AAPK6aee547fed8743aab40dfa36970a3933nhI5nmaqiL8F-y5QfBlWuZikfsCqFWUst0QTuJt7gHgCRwoiBl7E_oSPa0kZhTfs";
        
        const arcGisMap = new Map({
          basemap: "arcgis-topographic" // Basemap layer // 
        });
  
        const View = new MapView({
          map: arcGisMap,
          center: [-118.805, 34.027],
          zoom: 13, // scale: 72223.819286//
          container: "arcGisMap",
        });
    });