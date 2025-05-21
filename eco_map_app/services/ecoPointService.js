import api from './api';

export async function addPoint({ name, description, latitude, longitude, types }) {
  return await api.post('/eco-points/collection-point/', {
    name,
    description,
    latitude,
    longitude,
    types,
  });
}
