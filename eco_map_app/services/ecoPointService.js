import api from './api';

function extractOperatingHours(operatingHours) {
	let operating_hours = [];

	if (operatingHours[8]?.selected) {
		const [hOpen = '00', mOpen = '00'] = (operatingHours[8].open || '00:00').split(':');
		const [hClose = '23', mClose = '59'] = (operatingHours[8].close || '23:59').split(':');

		const fixedOpen = `${hOpen.padStart(2, '0')}:${mOpen.padStart(2, '0')}:00`;
		const fixedClose = `${hClose.padStart(2, '0')}:${mClose.padStart(2, '0')}:00`;

		// 1=segunda-feira, 2=terça-feira, ..., 7=domingo
		// 8=dia úteis
		 for (let day = 1; day <= 7; day++) {
			operating_hours.push({
			day_of_week: day,
			opening_time: fixedOpen,
			closing_time: fixedClose
			});
		}
	}

	for (const [key, value] of Object.entries(operatingHours)) {
		if (key === '8' || !value.selected) continue;

		const [hOpen = '00', mOpen = '00'] = (value.open || '00:00').split(':');
		const [hClose = '23', mClose = '59'] = (value.close || '23:59').split(':');

		operating_hours.push({
			day_of_week: value.name.toLowerCase(),
			opening_time: `${hOpen.padStart(2, '0')}:${mOpen.padStart(2, '0')}:00`,
			closing_time: `${hClose.padStart(2, '0')}:${mClose.padStart(2, '0')}:00`
		});	
	}

	return operating_hours;
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

	console.log('Payload to add point:', payload);

	return await api.post('/eco-points/collection-point/', payload);
}
