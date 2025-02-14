import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('dist'));
app.use(express.json());

const PORT = 8082;

const geoKey = process.env.GEONAMES_USERNAME;
const weatherKey = process.env.WEATHER_API_KEY;
const pixabayKey = process.env.PIXABAY_API_KEY;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/add-trip', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/add-trip.html'));
});

function geoUrl(city, username) {
    return `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`;
}

function weatherbitURL(lat, lon, key) {
    // return `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&units=M&days=${rDays}&key=${key}`;
    return `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&units=M&key=${key}`;
}

function pixabayURL(city, key) {
    const url = `https://pixabay.com/api/?key=${key}&q=${city}&image_type=photo`;
    
    console.log('pixabay url: ', url);
    return url;
}

let trips = [];
let i = 0;

app.post('/get-geo', async function (req, res) {
    const tripName = req.body.tripName;
    await fetch(geoUrl(req.body.city, geoKey), {
        method: 'GET',
        redirect: 'follow'
    })
        .then((response) => {
            if (!response.ok) {
                return res.status(400).json('Error');
            }

            return response.json();
        })
        .then((data) => {
            if (!trips[i]) {
                trips[i] = [];  // Initialize if undefined
            }

            trips[i].push({'tripName': tripName});
            trips[i].push({ 'geo': data });
            res.send(data);
        })
        .catch((error) => {
            console.log("error: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.post('/get-weather', async function (req, res) {
    const forecastDate = req.body.date;
    await fetch(weatherbitURL(req.body.lat, req.body.lon, weatherKey), {
        method: 'GET',
        redirect: 'follow'
    })
        .then((response) => {
            if (!response.ok) {
                return res.status(400).json('Error');
            }

            return response.json();
        })
        .then((data) => {
            const forecast = data.data.find(day => day.datetime === forecastDate);
            if (forecast) {
                console.log(`Weather on ${forecastDate}: ${forecast.weather.description}, ${forecast.temp}°C`);
                trips[i].push({ 'weather': forecast });
                res.send(forecast);
            } else {
                console.log("No forecast available for the requested date.");
                return res.status(400).json('No forecast available for the requested date.');
            }
        })
        .catch((error) => {
            console.log("error: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.post('/get-pixabay', async function (req, res) {
    const countryName = req.body.country;
    await fetch(pixabayURL(req.body.city, pixabayKey), {
        method: 'GET',
        redirect: 'follow'
    })
        .then((response) => {
            if (!response.ok) {
                return res.status(400).json('Error');
            }

            return response.json();
        })
        .then(async (data) => {
            if (data.hits.length === 0) {
                await fetch(pixabayURL(countryName, pixabayKey), {
                    method: 'GET',
                    redirect: 'follow'
                }).then((response) => {
                    if (!response.ok) {
                        return res.status(400).json('Error');
                    }
        
                    return response.json();
                })
                .then(async (data) => {
                    trips[i].push({ 'pixabay': data.hits[0] });
                    res.send(data);
                });
            } else {
                trips[i].push({ 'pixabay': data.hits[0] });
                res.send(data);
            }
            i += 1;
        })
        .catch((error) => {
            console.log("error: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.get('/data', function (req, res) {
    res.send({ 'message': 'Weather Info.', 'data': trips });
});

app.get('/last-id', function(req, res) {
    res.send({'index': i});
});

app.delete('/delete-all-trips', function(req, res) {
    trips = [];
    res.send({'message': 'All Trips Deleted successfully!'});
});

app.listen(PORT, () => {
    console.log(`Travel App Working on http://localhost:${PORT}`);
});
