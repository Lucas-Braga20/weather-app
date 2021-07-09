import axios from 'axios';

const baseUrl = 'http://dataservice.accuweather.com';

// Para testar a aplicação é necessário fazer um cadastro e criar uma key.
const key = 'null'; // Altere o valor da key.

// AccuWeatherAPI - Retorna as condições climáticas atuais e as previsões para as próximas 12 horas e próximos 5 dias.
// Cada cidade possui sua respectiva key, para executar a consulta nas condições climáticas é necessário a key como parâmetro da URL.
// Documentação: https://developer.accuweather.com/apis

export default {
    // Consulta a key específica da cidade.
    citySearch: function (cityName, callback) {
        const url = baseUrl + '/locations/v1/cities/search?apikey=' + key + '&q=' + cityName;

        axios.get(url)
            .then(response => callback(response.data));
    },
    // Consulta as condições climáticas para uma key.
    currentConditions: function (cityKey, callback) {
        const url = baseUrl + '/currentconditions/v1/' + cityKey + '?apikey=' + key + '&details=true';

        axios.get(url)
            .then(response => callback(response.data));
    },
    // Consulta as condições climáticas das próximas 12 horas para um key.
    hourlyForecasts: function (cityKey, callback) {
        const url = baseUrl + '/forecasts/v1/hourly/12hour/' + cityKey + '?apikey=' + key + '&metric=true';

        axios.get(url)
            .then(response => callback(response.data));
    },
    // Consulta as condições climáticas dos próximos 5 dias para uma key.
    dailyForecasts: function (cityKey, callback) {
        const url = baseUrl + '/forecasts/v1/daily/5day/' + cityKey + '?apikey=' + key + '&metric=true';

        axios.get(url)
            .then(response => callback(response.data));
    },
};