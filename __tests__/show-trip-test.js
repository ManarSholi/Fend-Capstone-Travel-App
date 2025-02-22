import { jest, describe, it, expect } from '@jest/globals';
import { getGeo, getWeather, getPixabay } from '../src/client/js/show-trips.js';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ test: 'data' }),
    })
);

describe('Client API Tests', () => {
    it('should call getGeo and return data', async () => {
        const data = await getGeo('http://localhost:8082/get-geo', { 'city': 'Nablus', 'tripName': 'Trip Name', 'tripDetail': 'Trip Detail' });
        expect(data).toEqual({ test: 'data' });

        expect(fetch).toHaveBeenCalled();
    });

    it('should call getWeather and return data', async () => {
        const data = await getWeather('http://localhost:8082/get-weather', { lat: "32.22111", lon: "35.25444", date: "2025-02-22" });
        expect(data).toEqual({ test: 'data' });
        expect(fetch).toHaveBeenCalled();
    });

    it('should call getPixabay and return data', async () => {
        const data = await getPixabay('http://localhost:8082/get-pixabay', { city: 'Nablus' });
        expect(data).toEqual({ test: 'data' });
        expect(fetch).toHaveBeenCalled();
    });
});