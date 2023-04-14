// leaflet kaart

var leafmap = L.map('leafletmap').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
        map: clubkaart,
        zoom: 6,
        
    });})


    // wms laag met geoserver //

    L.tileLayer.wms('http://localhost:8001/geoserver/ows' , {
      'layers' : 'nyc:gemeente_2021_v1',
      'styles' : 'polygon' ,
      'srs' : 'EPSG:28992' , 
      'format': 'image/png' , 
      'opacity': 0.5
    }).addTo(leafmap);


    // maplibre kaart

    var maplibrekaart = new maplibregl.Map({
    container: 'maplibrekaart',
    style: './JS/maplibre.json', // stylesheet location
    center: [5.3896944, 52.1562499], // starting position [lng, lat]
    zoom: 6, // starting zoom
    maxZoom: 9,
    minZoom: 6,
    });

    const popup = new maplibregl.Popup({ offset: 25 }).setText(
        'Gemeente Zeist'
    );
    
    const marker = new maplibregl.Marker({
        color: '#ffff'
    })
        .setLngLat([5.2332526, 52.0906015])
        .setPopup(popup)
        .addTo(maplibrekaart);

//Openlayerskaart//

const openlayersMap = new ol.Map({
    target: 'openlayers-map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([5.2213, 51.7160]),
      zoom: 8
    })
  });
  
  // Coördinaten van de stadions
  const fcGroningenCoords = ol.proj.fromLonLat([6.581390, 53.219170]);
  const rodaJCCoords = ol.proj.fromLonLat([6.002840, 50.899170]);
  
  // Lijn toevoegen van FC Groningen naar Roda JC
  const line = new ol.Feature({
    geometry: new ol.geom.LineString([
      fcGroningenCoords,
      rodaJCCoords
    ])
  });
  
  // Afstand tussen de twee stadions berekenen
  const distance = ol.sphere.getDistance(fcGroningenCoords, rodaJCCoords) / 1000; // in kilometers
  
  // Marker met label voor FC Groningen
  const fcGroningenMarker = new ol.Feature({
    geometry: new ol.geom.Point(fcGroningenCoords),
    name: 'FC Groningen'
  });
  
  // Marker met label voor Roda JC
  const rodaJCMarker = new ol.Feature({
    geometry: new ol.geom.Point(rodaJCCoords),
    name: 'Roda JC'
  });
  
  // Laag toevoegen met markers en lijn
  const vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [line, fcGroningenMarker, rodaJCMarker]
    }),
    style: function(feature) {
      if (feature.getGeometry().getType() === 'LineString') {
        return new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 5
          })
        });
      } else {
        return new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({
              color: [255,255,255], width: 2
            })
          }),
          text: new ol.style.Text({
            text: feature.get('name'),
            offsetY: -15,
            fill: new ol.style.Fill({ color: 'black' }),
            stroke: new ol.style.Stroke({
              color: [255,255,255], width: 2
            })
          })
        });
      }
    }
  });
  
  openlayersMap.addLayer(vectorLayer);
  
  // Afstand weergeven op de kaart
  const distanceText = document.createElement('div');
  distanceText.innerHTML = 'Afstand tussen FC Groningen en Roda JC: ' + distance.toFixed(2) + ' km';
  distanceText.style.position = 'absolute';
  distanceText.style.bottom = '10px';
  distanceText.style.left = '10px';
  openlayersMap.getViewport().appendChild(distanceText);

      
      

      

