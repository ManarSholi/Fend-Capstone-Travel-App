import "./styles/style.scss";
import {getTravelInfo, updateUI} from './js/show-trips.js';

const serverURL = 'http://localhost:8082';

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
        loadDatePicker();
        closeInfoSection();
    }).catch((error) => {
        console.log('Error in trip.', error);
    });
}

const deleteTrips = async (event) => {
    return await fetch(`${serverURL}/delete-all-trips`, {
        method: 'DELETE'
    })
    .then((response) => {
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

function closeInfoSection() {
    const closeSvg = document.getElementById('close');
    if (closeSvg) {
        closeSvg.addEventListener('click', (e) => {
            const addFormSection = document.getElementById('add-form-section');
            addFormSection.style.display = 'none';
        });
    }
}

function loadDatePicker() {
    const date = document.getElementById('date');
    const today = new Date();
    const maxDate = new Date();

    maxDate.setDate(today.getDate() + 16);

    const formateDate = (d) => {
        return d.toISOString().split('T')[0];
    }

    date.min = formateDate(today);
    date.max = formateDate(maxDate);
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