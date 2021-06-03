// On initialise la latitude et la longitude (centre de la carte)
var lat = 	45.764043;
var lon = 	4.835659;
var macarte = null;

// Fonction d'initialisation de la carte
function initMap() {
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);

}
window.onload = function(){
    initMap(); 
};


/*-----REQUETE AJAX------*/

let xhr = new XMLHttpRequest();
 
xhr.open('GET', 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=d740a08727f95149fb0e93946b0dbcb9ccd97d91');
 
xhr.addEventListener('load', function() {
 
    if (xhr.status >= 200 && xhr.status < 400) {
        callback(xhr.responseText);
 
    } else {
        callback(xhr.status);
    }
});
 
xhr.addEventListener('error', function() {
 
    console.log("erreur de connexion");
 
});
 
xhr.send(null);

function callback(response) {
    response = JSON.parse(response);
    response.forEach(function (info) {
  
  
      var info_station = 
      '<div>'  +
      '<ul>' +
        '<li>Station : ' + info.address + '</li>' +
        '<li>velos dispo : ' + info.available_bikes + '</li>' +
        '<li>Statut: ' + info.status + '</li>' +
      '</ul>' + 
      '</div>'
  
  
      L.marker(
          [info.position.lat, info.position.lng],
          {
            "jcdecauxInfo": info}           // on stocke ici toutes les infos
        )
               // fonction d'appel sur click
        .addTo(macarte)
        .bindPopup(info_station).openPopup();
    });
  };
  
 
 
function onMarkerClick(arg) {
  // Récupération du marker concerné
    let marker = arg.target;
  // Récupération des infos
    let info = marker.options.jcdecauxInfo;
    let address = info.address;
    let bikeStands = info.bike_stands;
    let availableBikes = info.available_bikes;
    let statusStation = info.status;
  // Affichage du rendu
  document.getElementById("info-station").style.display = "block";// Apparition du bloc contenant les infos de la station sélectionnée
  document.getElementById("adresse-station").innerText = address;
  document.getElementById("place-libre").innerHTML = bikeStands;
  document.getElementById("velo-dispo").innerHTML = availableBikes;
  document.getElementById("etat-station").innerHTML = statusStation;
}