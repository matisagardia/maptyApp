'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;


// asking to the browser for the geolocation, the function receives two callback functions as parameters, one for success and one for fail


if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(function(position) {

    const {latitude} = position.coords;
    const {longitude} = position.coords;

    const coords = [latitude, longitude];


    //getting the map code from leaflet page and store the map in a variable to add an eventListener and be able to get the coordinates
    // when the user clicks on the map

    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);


    // on method comes from the leaflet library called on the map object which has some properties and methods inside.
    // we take the marker from the main function and add it to the click event listener

    map.on('click', function(mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();


}, 
function() {
    alert('Could not get your position')
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear inputs

    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';

    //Display marker

        const {lat, lng} = mapEvent.latlng;

        L.marker([lat, lng])
        .addTo(map)
        .bindPopup(L.popup({
            //all this properties are in the leaflet documentation
            maxWidth: 200,
            minWidth: 80,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        }))
        .setPopupContent('Workout')
        .openPopup();
    });

})

// changing from running to cicling

inputType.addEventListener('change', function() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
})