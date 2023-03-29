// leaflet kaart

var leafmap = L.map('leafletmap').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(leafmap);


let mijnGeojsonLaag = L.geoJSON().addTo(leafmap); 

let woonplaatsen = ['Amersfoort','zeist','almere']
let woonplaatsNaam = woonplaatsen[1]

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
        leafmap.flyTo(centerCoordinates.coordinates.reverse());

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
        leafmap.flyTo(centerCoordinates.coordinates.reverse());

        } )

       //Arcgis kaart eredivisie//

    require(["esri/config","esri/WebMap","esri/views/MapView","esri/widgets/ScaleBar","esri/widgets/Legend"], function(esriConfig, WebMap, MapView, ScaleBar, Legend) {
    
    esriConfig.apiKey = "AAPK6aee547fed8743aab40dfa36970a3933nhI5nmaqiL8F-y5QfBlWuZikfsCqFWUst0QTuJt7gHgCRwoiBl7E_oSPa0kZhTfs";
    
    const clubkaart = new WebMap({
        portalItem: {
          id: "fb22eda5e1b840babbfad7a27994d11d"
        }
      });
    
    const view = new MapView({
      
        container: "clubkaart",
        map: clubkaart
    });})


    // wms laag met geoserver //

    L.tileLayer.wms('http://localhost:8001/geoserver/ows' , {
      'layers' : 'nyc:gemeente_2021_v1',
      'styles' : 'polygon' ,
      'srs' : 'EPSG:28992' , 
      'format': 'image/png' , 
      'opacity': 0.5
    }).addTo(leafmap);