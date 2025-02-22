# Travel App

This is a travel application that allows users to plan their trips by entering a destination and date. It fetches weather forecasts and images from external APIs.

## Features

* Enter a destination and date.
* View weather forecast for the trip date.
* See an image of the destination.
* Delete individual trips, or all trips.
* Service worker for offline capabilities.

## Technologies Used

* JavaScript (ES6+)
* Webpack
* Express.js
* Node.js
* Jest
* HTML5
* SCSS
* Geonames API
* Weatherbit API
* Pixabay API

## Installation

1.  Clone the repository:

    ```bash
    git clone [repository URL]
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add your API keys:

    ```
    GEONAMES_USERNAME=your_username
    WEATHER_API_KEY=your_key
    PIXABAY_API_KEY=your_key
    ```

4.  Run the development server:

    ```bash
    npm run build-dev
    npm run start
    ```

5.  Or, run the production build:

    ```bash
    npm run build-prod
    npm run start
    ```

6. Run the tests:
    ```bash
    npm run test
    ```

## Project Structure

Root
├── package.json
|
├── readme.md
|
├── src
|   |
|   |
│   ├── client
|   |   |
│   │   ├── index.js
|   |   |
│   │   ├── js
|   |   |   |
│   │   │   └── show-trips.js
|   |   |    
│   │   ├── styles
|   |   |   |
│   │   │   └── style.scss
|   |   |
│   │   └── views
|   |       |
│   │       └── index.html
|   |
│   └── server
|       |
│       └── index.js
|
├── __tests__
|   |
│   ├── index.test.js
│   │
│   └── show-trip-test.js
│
├── webpack.dev.js
├── webpack.prod.js

## Run The code 
    npm i
    npm run build-prod this will run on http://localhost:8082
    npm run build-dev this will run on http://localhost:8080
    npm run start

open client side on http://localhost:8080

## Further Improvements

* Add end date and display length of trip.
* Implement more robust error handling.
* Enhance service worker caching.

## Author

Manar Sholi
