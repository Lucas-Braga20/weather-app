import axios from 'axios';

const baseUrl = 'https://api.mapbox.com';

// Para testar a aplicação é necessário fazer um cadastro e criar uma key.
const key = 'null'; // Altere o valor da key.

// MapboxGeocodingAPI - Utilizado na "geocodificação direta", converte texto de localização em coordenadas geográficas.
// Documentação: https://docs.mapbox.com/api/search/geocoding/ 

export default {
    // Converte a string que contém a localização por texto em localização por coordenadas (Geocodificação Direta).
    searchLocation: function (search, callback) {
        const url = baseUrl + '/geocoding/v5/mapbox.places/' + encodeURI(search) + '.json?access_token=' + key;

        axios.get(url)
            .then(response => callback(response.data));
    }, 
};