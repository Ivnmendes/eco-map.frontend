import api from './api';

export async function addPoint(point) {
	let {name, description, latitude, longitude, types, street, number, postcode, neighborhood} = point;

	const pointHasMapCoordinates = latitude !== undefined && longitude !== undefined;

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
	};

	return await api.post('/eco-points/collection-point/', payload);
}
