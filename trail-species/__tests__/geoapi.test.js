const axios = require('axios');

const BASE_URL = "https://trailgeoapi.onrender.com";


jest.setTimeout(30000); 

describe('GeoAPI Backend Tests', () => {

    test('GET /trails_by_name - Returns correct GeoJSON for "Frost Pocket Path"', async () => {
        const trailName = "Frost Pocket Path";
        const response = await axios.get(`${BASE_URL}/trails_by_name`, {
            params: { name: trailName }
        });

        expect(response.status).toBe(200);

        
        let data = response.data;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error("Received 200 OK but data was not valid JSON.");
            }
        }

        
        expect(data.type).toBe("FeatureCollection");
        expect(Array.isArray(data.features)).toBe(true);
        expect(data.features.length).toBeGreaterThan(0);

        const firstFeature = data.features[0];
        expect(firstFeature.type).toBe("Feature");
        expect(firstFeature.properties.name).toBe(trailName);
    });

    test('GET /trails_by_name - Returns message for unknown trail', async () => {
        const fakeName = "Ghost Trail XYZ";
        const response = await axios.get(`${BASE_URL}/trails_by_name`, {
            params: { name: fakeName }
        });

        expect(response.status).toBe(200);
        
        let data = response.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) {}
        }

        
        expect(data).toHaveProperty("message");
        expect(data.message).toContain(`No trail found with name '${fakeName}'`);
    });
});