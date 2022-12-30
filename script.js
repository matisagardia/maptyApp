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


class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
    }
}


// define the class App with all the methods inside and calling the _getPosition method to start running the app
// APP ARCHITECTURE

class App {

    #map;
    #mapEvent;
    #workouts = [];

    constructor() {
        this._getPosition();
        // we have to bind the word this on the method called in the eventListener because it originally points to where it is called, which is 
        // the form, not the App.
        form.addEventListener('submit',this._newWorkout.bind(this));
        
        // changing from running to cicling
        
        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        // asking to the browser for the geolocation, the function receives two callback functions as parameters, one for success and one for fail.
        if (navigator.geolocation)
        // we have to bind the this keyword on the callback function to attach it to the App class and not the navigator
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
            alert('Could not get your position');
        });
    }

    _loadMap(position) {        
        const {latitude} = position.coords;
        const {longitude} = position.coords;
    
        const coords = [latitude, longitude];

        //getting the map code from leaflet page and store the map in a variable to add an eventListener and be able to get the coordinates
        // when the user clicks on the map
    
        this.#map = L.map('map').setView(coords, 13);
    
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(this.#map);
    
        // on method comes from the leaflet library called on the map object which has some properties and methods inside.
        // we take the marker from the main function and add it to the click event listener
    
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e){

        e.preventDefault();

        // create functions for checking the input values

        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        // get data from the form and define let workout to be used inside the blocks here
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;

        // if activity running, create running object
        if(type === 'running') {
        // check if data is valid
            const cadence = +inputCadence.value;

            if(!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) 
            return alert('Inputs have to be positive numbers!');

            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // if cycling, create cycling object
        if(type === 'cycling') {
            const elevation = +inputElevation.value;

            if(!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) 
            return alert('Inputs have to be positive numbers!');
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        // add object to the workout array

        this.#workouts.push(workout);

        // render workout on the map as marker

        this._renderWorkoutMarker(workout);

        // render workout on list



        // Clear inputs
    
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';
    
        }

    _renderWorkoutMarker(workout) {
        L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(L.popup({
            //all this properties are in the leaflet documentation
            maxWidth: 200,
            minWidth: 80,
            autoClose: false,
            closeOnClick: false,
            className: `${type}-popup`,
        }))
        .setPopupContent(workout.distance)
        .openPopup();
    }

}

// storing a new App inside the app variable

const app = new App();

