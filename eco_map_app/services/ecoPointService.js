import api from './api';

function extractOperatingHours(operatingHours) {
	const dayMap = new Map();

	for (let dayKey = 1; dayKey <= 7; dayKey++) {
        const key = String(dayKey);
        const value = operatingHours[key];

        if (value?.selected) {
            const [hOpen = '00', mOpen = '00'] = (value.open || '00:00').split(':');
            const [hClose = '23', mClose = '59'] = (value.close || '23:59').split(':');

            dayMap.set(dayKey, {
                day_of_week: dayKey,
                opening_time: `${hOpen.padStart(2, '0')}:${mOpen.padStart(2, '0')}:00`,
                closing_time: `${hClose.padStart(2, '0')}:${mClose.padStart(2, '0')}:00`
            });
        }
    }

	if (operatingHours[8]?.selected) {
        const [hOpen = '00', mOpen = '00'] = (operatingHours[8].open || '00:00').split(':');
        const [hClose = '23', mClose = '59'] = (operatingHours[8].close || '23:59').split(':');

        const generalTime = {
            opening_time: `${hOpen.padStart(2, '0')}:${mOpen.padStart(2, '0')}:00`,
            closing_time: `${hClose.padStart(2, '0')}:${mClose.padStart(2, '0')}:00`
        };
        
        for (let dayKey = 1; dayKey <= 7; dayKey++) {
            if (!dayMap.has(dayKey)) {
                dayMap.set(dayKey, {
                    day_of_week: dayKey,
                    ...generalTime
                });
            }
        }
    }

	return Array.from(dayMap.values());
}

export async function addPoint(point) {
	let { name, description, latitude, longitude, types, street, number, postcode, neighborhood, operatingHours } = point;

	const pointHasMapCoordinates = latitude !== undefined && longitude !== undefined;

	const operating_hours = extractOperatingHours(operatingHours);

	if (!pointHasMapCoordinates) {
		const response = await api.get('/geo-code/geocode/', {
			params: {
				street,
				number,
				postcode,
				neighborhood
			},
			timeot: 5000
		});

		if (!response.data || !response.data.lat || !response.data.lon) {
			throw new Error('Resposta da geocodificação inválida: coordenadas não encontradas.');
		}
		
		latitude = response.data.lat;
		longitude = response.data.lon;
	}

	latitude = parseFloat(latitude).toFixed(6);
	longitude = parseFloat(longitude).toFixed(6);
	
	const payload = {
		name,
		description,
		types,
		latitude,
		longitude,
		operating_hours
	};

	return await api.post('/eco-points/collection-point/', payload);
}

export async function reverseGeocodeApi(latitude, longitude) {
	const response = await api.get(`/geo-code/reverse-geocode/`, { 
		params: { lat: latitude, lon: longitude }
	});
	return response.data;
};