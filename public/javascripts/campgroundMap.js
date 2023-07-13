mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center:parsedCampground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11, // starting zoom
});

 
const marker = new mapboxgl.Marker()
     .setLngLat(parsedCampground.geometry.coordinates)
     .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h5>${parsedCampground.title}<p>${parsedCampground.location}</p></h5>`
        )
        )
     .addTo(map);
    
