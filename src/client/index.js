import "./styles/style.scss";
import {getTravelInfo, updateUI} from './js/show-trips.js';

const serverURL = 'http://localhost:8082';
let countryName = '';

async function addTrip() {
    return await fetch(`${serverURL}/add-trip`, {
        method: 'GET',
        redirect: "follow"
    }).then(async (response) => {
        const htmlContent = await response.text();
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = htmlContent;
        }

        addTravelInfoListener();
    }).catch((error) => {
        console.log('Error in trip.');
    });
}

const deleteTrips = async (event) => {
    return await fetch(`${serverURL}/delete-all-trips`, {
        method: 'DELETE'
    })
    .then((response) => {
        console.log("response: ", response);
        updateUI(event);
        document.getElementById('result-section').innerHTML = '';
        return response.json();
    })
    .then((data) => {
        return data;
    })
    .catch((error) => {
        console.error('Error in deleting all trips.', error);
    });
}

function addTravelInfoListener() {
    const travelInfoButton = document.getElementById('travel-info');

    if (travelInfoButton) {
        travelInfoButton.addEventListener('click', (e) => getTravelInfo(e));
    } else {
        console.log('Travel Info Button Not Work!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addTripButton = document.getElementById('add-trip');

    if (addTripButton) {
        addTripButton.addEventListener('click', addTrip);
    } else {
        console.error("Error: #add-trip button not found!");
    }

    const deleteAllTrips = document.getElementById('delete-all-trips');
    if (deleteAllTrips) {
        deleteAllTrips.addEventListener('click', (e) => deleteTrips(e));
    }
});

window.addEventListener('load', (e) => updateUI(e));