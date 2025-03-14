const serverURL = 'http://localhost:8082';
let countryName = '';
let tripId;

const getTravelInfo = async (event) => {
    const city = document.getElementById('city').value;
    const date = document.getElementById('date').value;
    const tripName = document.getElementById('trip-name').value;
    const tripDetail = document.getElementById('trip-detail').value;

    tripId = await fetch(`${serverURL}/last-id`)
        .then((response) => {
            if (!response.ok) {
                console.error(`Fetch Error: ${response.status} ${response.statusText}`);
                throw new Error(`Fetch Error: ${response.status} ${response.statusText}`);
            }

            return response.json();
        })
        .then((data) => {
            return JSON.stringify(data.index);
        })
        .catch((error) => {
            return 0;
        });

    tripId = Number(tripId) + 1;

    if (!city) {
        alert('Please enter the city.');
        return;
    }

    getGeo(`${serverURL}/get-geo`, { 'city': city, 'tripName': tripName, 'tripDetail': tripDetail })
        .then((geo) => {
            if (!geo) {
                throw new Error('No data available.');
            }

            const geoNames = geo.geonames[0];
            const lat = geoNames.lat;
            const lon = geoNames.lng;
            countryName = geoNames.countryName;

            return getWeather(`${serverURL}/get-weather`, {
                'lat': lat,
                'lon': lon,
                'date': date
            });
        })
        .then((weather) => {
            if (!weather) {
                throw new Error('No data available.');
            }

            const weatherDesc = weather ? weather.weather.description : '';

            return getPixabay(`${serverURL}/get-pixabay`, { 'city': city + ' ' + weatherDesc, 'country': countryName + ' ' + weatherDesc });
        })
        .then(() => {
            updateUI(event);
        })
        .catch((error) => {
            console.error('Unable to fetch data:', error);
        });
}

const getGeo = async (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Fetch Error: ${response.status} ${response.statusText}`);
                throw new Error(`Fetch Error: ${response.status} ${response.statusText}`);
            }

            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log('Error Getting GEO: ', error);
        });
}

const getWeather = async (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Fetch Error: ${response.status} ${response.statusText}`);
                throw new Error(`Fetch Error: ${response.status} ${response.statusText}`);
            }

            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log("Error Getting Weather Data: ", error);
        });
}

const getPixabay = async (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Fetch Error: ${response.status} ${response.statusText}`);
                throw new Error(`Fetch Error: ${response.status} ${response.statusText}`);
            }

            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log("Error Getting Pixabay Data: ", error);
        });
}

const updateUI = async (event) => {
    if (!document.getElementById('content').hasChildNodes()) {
        document.querySelector('.data-section').style.display = 'none';
    }

    return fetch(`${serverURL}/data`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Unable to fetch UI data.');
            }

            return response.json();
        })
        .then((data) => {
            const res = data.data;
            if (event.type === 'load') {
                const elements = document.getElementsByClassName('trips-div');
                if (elements.length === 0) {
                    for (let i = 0; i < res.length; i++) {
                        const result = res[i];
                        if (result && result.length !== 0) {
                            createElements(i);
                        }
                    }
                }
            }

            let geo = {};
            let weather = {};
            let pixabay = {};
            let tripName = '';
            let tripDetail = '';

            for (let i = 0; i < res.length; i++) {
                const result = res[i];
                if (result && result.length !== 0) {
                    tripName = result[0].tripName;
                    tripDetail = result[1].tripDetail;
                    geo = result[2].geo.geonames[0];
                    if (geo) {
                        weather = result[3].weather;
                    } else {
                        weather = result[2].weather;
                    }
                    if (weather) {
                        pixabay = result[4].pixabay;
                    } else {
                        pixabay = result[3].pixabay;
                    }

                    let img = document.getElementById(`place-img${i}`);
                    let title = document.getElementById(`trip-title${i}`);
                    let datetime = document.getElementById(`trip-date-${i}`);
                    let weatherInfo = document.getElementById(`weather-info${i}`);
                    let state = document.getElementById(`state${i}`);
                    let deleteTrip = document.getElementById(`delete-trip-${i}`);
                    let tDetail = document.getElementById(`trip-detail${i}`);

                    if (!img) {
                        createElements(i);
                        img = document.getElementById(`place-img${i}`);
                        title = document.getElementById(`trip-title${i}`);
                        datetime = document.getElementById(`trip-date-${i}`);
                        weatherInfo = document.getElementById(`weather-info${i}`);
                        state = document.getElementById(`state${i}`);
                        deleteTrip = document.getElementById(`delete-trip-${i}`);
                        tDetail = document.getElementById(`trip-detail${i}`);
                    }

                    img.src = pixabay.webformatURL;
                    tripName = '<div class="t-title">' + tripName.charAt(0).toUpperCase() + tripName.slice(1) + '</div>';
                    title.innerHTML = tripName + '<br> My trip to: ' + (geo ? (geo.name + ', ' + geo.countryName) : geo.countryName) + '<br>Departing: ' + (weather ? weather.datetime : '');
                    weatherInfo.innerHTML = weather ? ('Typical weather for then is: <br>' + 'High: ' + weather.high_temp + ', Low: ' + weather.low_temp) : '';
                    state.innerHTML = weather ? (weather.weather.description) : '';
                    tDetail.innerHTML = '<strong>Trip Detail</strong><br>' + tripDetail;

                    deleteTripAction(deleteTrip);
                }
            }
        })
        .catch((error) => {
            console.error('Unable to fetch data:', error);
        });
}

const deleteSpecificTrip = async (e) => {
    const tripId = e.srcElement.id.split('-')[2];

    return await fetch(`${serverURL}/delete-trip/${tripId}`, {
        method: 'DELETE'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Cannot delete this trip.');
            }

            return response.json();
        })
        .then((data) => {
            location.reload();
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

function deleteTripAction(deleteTrip) {
    if (deleteTrip) {
        deleteTrip.addEventListener('click', (e) => deleteSpecificTrip(e));
    }
}

function createElements(i) {
    const divElement = document.createElement('div');
    const img = document.createElement('img');
    const divChildren = document.createElement('div');
    const title = document.createElement('h3');
    const date = document.createElement('span');
    const weatherInfo = document.createElement('p');
    const state = document.createElement('p');
    const deleteTrip = document.createElement('button');
    const deleteTripDiv = document.createElement('div');
    const tripDetail = document.createElement('p');

    divElement.setAttribute('id', `trip-div${i}`);
    divElement.setAttribute('class', 'trips-div');

    img.setAttribute('id', `place-img${i}`);
    img.setAttribute('class', `place-img`);

    divChildren.setAttribute('id', `div-child${i}`);
    divChildren.setAttribute('class', `div-child`);

    title.setAttribute('id', `trip-title${i}`);
    title.setAttribute('class', `trip-title`);

    tripDetail.setAttribute('id', `trip-detail${i}`);
    tripDetail.setAttribute('class', `trip-d`);

    date.setAttribute('id', `trip-date-${i}`);
    weatherInfo.setAttribute('id', `weather-info${i}`);
    state.setAttribute('id', `state${i}`);

    deleteTripDiv.setAttribute('class', 'delete-trip-div');
    deleteTrip.setAttribute('type', 'submit');
    deleteTrip.setAttribute('id', `delete-trip-${i}`);
    deleteTrip.setAttribute('class', `delete-trip`);
    deleteTrip.textContent = 'Delete Trip';

    deleteTripDiv.appendChild(deleteTrip);
    title.appendChild(date);
    divChildren.appendChild(title);
    divChildren.appendChild(weatherInfo);
    divChildren.appendChild(state);
    divChildren.appendChild(tripDetail);
    divChildren.appendChild(deleteTripDiv);

    divElement.appendChild(img);
    divElement.appendChild(divChildren);

    const resultSection = document.getElementById('result-section');
    resultSection.appendChild(divElement);
}

export {
    getGeo,
    getPixabay,
    getWeather,
    getTravelInfo,
    updateUI
}