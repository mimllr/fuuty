export interface StadiumCoords {
  lat: number
  lng: number
  name: string
  city: string
  timezone: string
}

export const STADIUM_COORDS: Record<string, StadiumCoords> = {
  '1': {
    lat: 19.302837,
    lng: -99.150803,
    name: 'Estadio Azteca',
    city: 'Mexico City',
    timezone: 'America/Mexico_City',
  },
  '2': {
    lat: 20.681721,
    lng: -103.463135,
    name: 'Estadio Akron',
    city: 'Guadalajara',
    timezone: 'America/Mexico_City',
  },
  '3': {
    lat: 25.669132,
    lng: -100.244621,
    name: 'Estadio BBVA',
    city: 'Monterrey',
    timezone: 'America/Monterrey',
  },
  '4': {
    lat: 32.748138,
    lng: -97.093231,
    name: 'AT&T Stadium',
    city: 'Dallas',
    timezone: 'America/Chicago',
  },
  '5': {
    lat: 29.684702,
    lng: -95.410965,
    name: 'NRG Stadium',
    city: 'Houston',
    timezone: 'America/Chicago',
  },
  '6': {
    lat: 39.048855,
    lng: -94.484474,
    name: 'Arrowhead Stadium',
    city: 'Kansas City',
    timezone: 'America/Chicago',
  },
  '7': {
    lat: 33.755371,
    lng: -84.401436,
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    timezone: 'America/New_York',
  },
  '8': {
    lat: 25.95783,
    lng: -80.239326,
    name: 'Hard Rock Stadium',
    city: 'Miami',
    timezone: 'America/New_York',
  },
  '9': {
    lat: 42.09079,
    lng: -71.264404,
    name: 'Gillette Stadium',
    city: 'Boston',
    timezone: 'America/New_York',
  },
  '10': {
    lat: 39.901325,
    lng: -75.167862,
    name: 'Lincoln Financial Field',
    city: 'Philadelphia',
    timezone: 'America/New_York',
  },
  '11': {
    lat: 40.813477,
    lng: -74.074951,
    name: 'MetLife Stadium',
    city: 'New York',
    timezone: 'America/New_York',
  },
  '12': {
    lat: 43.633087,
    lng: -79.418961,
    name: 'BMO Field',
    city: 'Toronto',
    timezone: 'America/Toronto',
  },
  '13': {
    lat: 49.276646,
    lng: -123.112564,
    name: 'BC Place',
    city: 'Vancouver',
    timezone: 'America/Vancouver',
  },
  '14': {
    lat: 47.595135,
    lng: -122.331917,
    name: 'Lumen Field',
    city: 'Seattle',
    timezone: 'America/Los_Angeles',
  },
  '15': {
    lat: 37.403297,
    lng: -121.969765,
    name: "Levi's Stadium",
    city: 'San Francisco',
    timezone: 'America/Los_Angeles',
  },
  '16': {
    lat: 33.953438,
    lng: -118.339447,
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    timezone: 'America/Los_Angeles',
  },
}
