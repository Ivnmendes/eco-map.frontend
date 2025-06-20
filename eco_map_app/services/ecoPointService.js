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


export async function createCollectionPoint(pointData) {
	let { 
        name, description, latitude, longitude, types, 
        street, number, postcode, neighborhood, operatingHours 
    } = pointData;

	const pointHasMapCoordinates = latitude !== undefined && latitude !== '';

	if (!pointHasMapCoordinates) {
		const response = await api.get('/geo-code/geocode/', {
			params: { street, number, postcode, neighborhood },
			timeout: 5000
		});

		if (!response.data || !response.data.lat || !response.data.lon) {
			throw new Error('Resposta da geocodificação inválida: coordenadas não encontradas.');
		}
		
		latitude = response.data.lat;
		longitude = response.data.lon;
	}

	const processedHours = extractOperatingHours(operatingHours);

	const payload = {
		name,
		description,
		types,
		latitude: parseFloat(latitude).toFixed(6),
		longitude: parseFloat(longitude).toFixed(6),
		operating_hours: processedHours
	};

	const response = await api.post('/eco-points/collection-points/', payload);
    return response.data;
}

export async function uploadImageForPoint(pointId, imageAsset) {
    const formData = new FormData();

    formData.append('image', {
        uri: imageAsset.uri,
        type: imageAsset.mimeType || 'image/jpeg',
        name: imageAsset.fileName || `point_image_${Date.now()}.jpg`,
    });

    return await api.post(`/eco-points/collection-point/${pointId}/upload_image/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}


export async function reverseGeocodeApi(latitude, longitude) {
	const response = await api.get(`/geo-code/reverse-geocode/`, { 
		params: { lat: latitude, lon: longitude }
	});
	return response.data;
};

export async function getUserCollectionPoints(page) {
    const response = await api.get('/eco-points/collection-points/my-submits/', {
        params: { page }
    });
    if (response.status !== 200) {
        throw new Error('Erro ao obter pontos de coleta do usuário');
    }
    return response.data;   
}

export async function deletePoint(pointId) {
    const response = await api.delete(`/eco-points/collection-points/${pointId}/`);
    if (response.status !== 204) {
        throw new Error('Erro ao deletar ponto de coleta');
    }
    return response.data;
}

export async function getPointDetails(pointId) {
    const response = await api.get(`/eco-points/collection-points/${pointId}/`);
    if (response.status !== 200) {
        throw new Error('Erro ao obter detalhes do ponto de coleta');
    }
    return response.data;
}