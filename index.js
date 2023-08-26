'use strict';
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class Workout {
  date = new Date();
  id = (this.date.getTime() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.duration = duration;
    this.distance = distance;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, steps) {
    super(coords, distance, duration);
    this.steps = steps;
    this.calcPace();
  }
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #object;

  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleEllevation.bind(this));
    containerWorkouts.addEventListener('click', this._scrolling.bind(this));
  }
  _scrolling(e) {
    let x = e.target.closest('.workout');
    let finding = x.dataset.id;

    let required = this.#workouts.findIndex(function (mov, i) {
      return Number(finding) === Number(mov.id);
    });

    let coobject = this.#workouts[required].coords;
    this.#map.setView(coobject, 13);
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),

      function () {
        console.log('unable to fetch your location');
      }
    );
  }

  _loadMap(position) {
    let obj = position.coords;
    let lat = obj.latitude;
    let lon = obj.longitude;
    let arr = [lat, lon];

    this.#map = L.map('map').setView(arr, 13);
    let maping = this.#map;
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._displayForm.bind(this));
    console.log(this.#map);
    this.#workouts = JSON.parse(localStorage.getItem('workout'));
    console.log(this.#workouts);
    if (this.#workouts.length != 0) {
      this.#workouts.forEach(function (val) {
        let typing = val.type;
        if (typing === 'running') {
          let month = months[new Date(val.date).getMonth()];
          console.log(month);
          let day = new Date(val.date).getDate();
          let ids = val.id;
          let html = `<li class="workout workout--running" data-id=${ids}>
                      <h2 class="workout__title">Running on ${month} ${day}</h2>
                      <div class="workout__details">
                        <span class="workout__icon">🏃‍♂️</span>
                        <span class="workout__value">${val.distance}</span>
                        <span class="workout__unit">km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${val.duration}</span>
                        <span class="workout__unit">min</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${val.pace.toFixed(
                          1
                        )}</span>
                        <span class="workout__unit">min/km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${val.steps}</span>
                        <span class="workout__unit">spm</span>
                      </div>
                    </li>`;
          form.insertAdjacentHTML('afterend', html);
          L.marker(val.coords)
            .addTo(maping)
            .bindPopup(
              L.popup({
                maxWidth: 300,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${typing}-popup`,
              })
            )
            .setPopupContent(`Running on ${month} ${day}`)
            .openPopup();
        }
        if (typing === 'cycling') {
          let month = months[new Date(val.date).getMonth()];
          console.log(month);
          let day = new Date(val.date).getDate();
          let ids = val.id;
          let html = `<li class="workout workout--running" data-id=${ids}>
                      <h2 class="workout__title">Running on ${month} ${day}</h2>
                      <div class="workout__details">
                        <span class="workout__icon">🚴‍♀️</span>
                        <span class="workout__value">${val.distance}</span>
                        <span class="workout__unit">km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${val.duration}</span>
                        <span class="workout__unit">min</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${val.speed.toFixed(
                          1
                        )}</span>
                        <span class="workout__unit">min/km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⛰</span>
                        <span class="workout__value">${val.elevation}</span>
                        <span class="workout__unit">m</span>
                      </div>
                    </li>`;
          form.insertAdjacentHTML('afterend', html);
          L.marker(val.coords)
            .addTo(maping)
            .bindPopup(
              L.popup({
                maxWidth: 300,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${typing}-popup`,
              })
            )
            .setPopupContent(`Running on ${month} ${day}`)
            .openPopup();
        }
      });
    }
  }

  _displayForm(e) {
    form.classList.remove('hidden');
    inputDistance.focus();
    this.#object = e.latlng;
  }

  _toggleEllevation(e) {
    e.preventDefault();
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    let work = inputType.value;
    let dist = Number(inputDistance.value);
    let dura = Number(inputDuration.value);

    if (work === 'cycling') {
      let ele = Number(inputElevation.value);
      let cyc = new Cycling(
        [this.#object.lat, this.#object.lng],
        dist,
        dura,
        ele
      );

      this.#workouts.push(cyc);

      let month = months[cyc.date.getMonth()];
      let day = cyc.date.getDate();
      let ids = cyc.id;
      let html = `<li class="workout workout--cycling" data-id="${cyc.id}">
                  <h2 class="workout__title">Cycling on ${month} ${day}</h2>
                  <div class="workout__details">
                    <span class="workout__icon">🚴‍♀️</span>
                    <span class="workout__value">${cyc.distance}</span>
                    <span class="workout__unit">km</span>
                  </div>
                  <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${cyc.duration}</span>
                    <span class="workout__unit">min</span>
                  </div>
                  <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${cyc.speed.toFixed(1)}</span>
                    <span class="workout__unit">km/h</span>
                  </div>
                  <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${cyc.elevation}</span>
                    <span class="workout__unit">m</span>
                  </div>
                </li>`;
      form.insertAdjacentHTML('afterend', html);
      L.marker([this.#object.lat, this.#object.lng])
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 300,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${work}-popup`,
          })
        )
        .setPopupContent(`Cycling on ${month} ${day}`)
        .openPopup();
      form.classList.add('hidden');
    }
    if (work === 'running') {
      let cad = Number(inputCadence.value);
      let runs = new Running(
        [this.#object.lat, this.#object.lng],
        dist,
        dura,
        cad
      );

      this.#workouts.push(runs);

      let month = months[runs.date.getMonth()];
      let day = runs.date.getDate();
      let ids = runs.id;
      let html = `<li class="workout workout--running" data-id=${ids}>
                      <h2 class="workout__title">Running on ${month} ${day}</h2>
                      <div class="workout__details">
                        <span class="workout__icon">🏃‍♂️</span>
                        <span class="workout__value">${runs.distance}</span>
                        <span class="workout__unit">km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${runs.duration}</span>
                        <span class="workout__unit">min</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${runs.pace.toFixed(
                          1
                        )}</span>
                        <span class="workout__unit">min/km</span>
                      </div>
                      <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${runs.steps}</span>
                        <span class="workout__unit">spm</span>
                      </div>
                    </li>`;
      form.insertAdjacentHTML('afterend', html);
      L.marker([this.#object.lat, this.#object.lng])
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 300,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${work}-popup`,
          })
        )
        .setPopupContent(`Running on ${month} ${day}`)
        .openPopup();
      form.classList.add('hidden');
    }

    localStorage.setItem('workout', JSON.stringify(this.#workouts));

    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
  }
}
let app = new App();
