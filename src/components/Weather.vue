<template>
    <div class="background-weather-app">
        <LoadingSpinner v-if="loading"/>
        <div class="container-weather-app">
            <div class="container-search">
                <div class="container-input-city">
                    <label v-on:click="searchLocation()" class="label-city" for="city-search">
                        <i class="fas fa-search"></i>
                    </label>
                    <input v-on:keyup.enter="searchLocation()" id="city-search" ref="citySearch" class="input-city" placeholder="Pesquise por outra localização..." type="text">
                </div>
                <div class="bottom-bar"></div>
            </div>
            <CurrentConditions
                :cityName="cityName"
                :regionName="regionName"
                :date="date"
                :weatherIcon="weatherIcon"
                :weatherText="weatherText"
                :temperature="temperature"
                :wind="wind"
                :humidity="humidity"
                :UVIndex="UVIndex"
                :key="currentKey"/>
            <HourlyConditions :key="hourlyKey" :conditions="twelveHourlyForecasts"/>
            <DailyConditions :key="dailyKey" :conditions="fiveDailyForecasts"/>
        </div>
    </div>
</template>

<script>
// APIs
import IpAPI from '../services/IpAPI.js';
import AccuWeatherAPI from '../services/AccuWeatherAPI.js'; // REQUER KEY.
import MapboxGeocodingAPI from '../services/MapboxGeocodingAPI'; // // REQUER KEY.

// Componentes
import CurrentConditions from './CurrentConditions.vue';
import HourlyConditions from './HourlyConditions.vue';
import DailyConditions from './DailyConditions.vue';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
    components: {
        CurrentConditions,
        HourlyConditions,
        DailyConditions,
        LoadingSpinner,
    },
    data() {
        return { 
            dailyKey: 0, // Key do componente DailyConditions, para forçar renderização.
            hourlyKey: 0, // Key do componente HourlyConditions, para forçar renderização.
            currentKey: 0, // Key do componente CurrentConditions, para forçar renderização.

            loading: false, // Responsável por habilitar ou desabilitar o componente de loading.

            date: new Date(), // Data e horário de acesso.

            // Geolocation.
            cityName: 'Dourados', // Cidade localizada através do IP.
            regionName: 'Mato Grosso do Sul', // Estado localizado através do IP.
            cityKey: 0, // Cidade Key para a AccuWeather API.
            lat: 0, // Latitude localizada através do IP.
            lon: 0, // Longitute localizada através do IP.

            // Current Conditions.
            weatherIcon: 1, // Ícone da condição climática.
            weatherText: 'Clear', // Condição climática.
            temperature: { 
                celsius: 15.7, // Tempertura em Celsius.
                fahrenheit: 0, // Tempertura em Fahrenheit.
            },
            wind: {
                direction: 'ESE', // Direção do vento.
                speedValue: 16.7, // Velocidade do vento.
                unit: 'km/h' // Unidade de medida.
            },
            humidity: 51, // Umidade em porcentagem.
            UVIndex: 3, // Índice Ultravioleta

            // 12 Hours of Hourly Forecasts
            twelveHourlyForecasts: [],

            // 5 Days of Daily Forecasts
            fiveDailyForecasts: [],
        };
    },
    mounted: function () {
        // Recebe o evento 'stopLoading', responsável por desabilitar o componente de loading.
        this.emitter.on('stopLoading', () => this.loading = false);
    },
    created: function () {
        this.loading = true; // Habilita o Loading.
        this.getDate(); // Recebe a data de acesso.

        // Consulta a localização através do IP.
        this.getLocation().then(() => {
            // Consulta a key da AccuWeatherAPI para a localização.
            this.getCityKey().then(() => {
                this.getCurrentConditions(); // Recebe as condições atuais.
                this.getHourlyForecasts(); // Recebe a previsão das próximas 12 horas.
                this.getDailyForecasts(); // Recebe a previsão dos próximos 5 dias. 
            });
        });
    },
    methods: {
        // Os métodos:
        //      getLocation,            IpAPI
        //      getLocationBySearch,    MapboxGeocodingAPI
        //      getCityKey,             AccuWeatherAPI
        //      getCurrentConditions,   AccuWeatherAPI
        //      getHourlyForecasts,     AccuWeatherAPI
        //      getDailyForecasts,      AccuWeatherAPI
        // Fazem requisição a APIs e algumas requisições necessitam da resposta de outras, e, devido ao assincronismo da linguagem foi utilizada as "promises".
        // Portanto, quando uma requisição for feita, as próximas só poderão ser executadas através do "then".

        getDate: function () {
            this.date = new Date();
        },
        getLocation: function () {
            return new Promise((resolve, reject) => {
                IpAPI.getGeolocation(data => {
                    if(!data) {
                        reject();
                    }

                    this.cityName = data.city;
                    this.regionName = data.regionName;
                    this.lat = data.lat;
                    this.lon = data.lon;

                    resolve();
                });
            });
        },
        getLocationBySearch: function (search) {
            return new Promise((resolve, reject) => {
                MapboxGeocodingAPI.searchLocation(search, data => {
                    if(!data) {
                        reject();
                    }

                    this.cityName = data.features[0].text;
                    this.regionName = data.features[0].context[0].text;
                    this.lat = data.features[0].center[1];
                    this.lon = data.features[0].center[0];

                    resolve();
                });
            });
        },
        getCityKey: function () {
            return new Promise((resolve, reject) => {
                AccuWeatherAPI.citySearch(this.cityName, data => {
                    if(!data) {
                        reject();
                    }

                    this.cityKey = data[0].Key;

                    resolve();
                });
            });
        },
        getCurrentConditions: function () {
            return new Promise((resolve, reject) => {
                AccuWeatherAPI.currentConditions(this.cityKey, data => {
                    if(!data) {
                        reject();
                    }

                    this.weatherIcon = data[0].WeatherIcon;
                    this.weatherText = data[0].WeatherText;
                    this.temperature.celsius = data[0].Temperature.Metric.Value;
                    this.temperature.fahrenheit = data[0].Temperature.Imperial.Value;

                    this.wind = new Object();
                    this.wind.direction = data[0].Wind.Direction.Localized; 
                    this.wind.speedValue = data[0].Wind.Speed.Metric.Value;
                    this.wind.unit = data[0].Wind.Speed.Metric.Unit;

                    this.humidity = data[0].RelativeHumidity;
                    this.UVIndex = data[0].UVIndex;

                    resolve();
                });
            });
        },
        getHourlyForecasts: function () {
            return new Promise((resolve, reject) => {
                AccuWeatherAPI.hourlyForecasts(this.cityKey, data => {
                    if(!data) {
                        reject();
                    }

                    this.twelveHourlyForecasts = [];

                    for(let i in data) {
                        let condition = new Object();

                        condition.hour = data[i].DateTime;
                        condition.temperature = new Object();
                        condition.temperature.celsius = data[i].Temperature.Value;
                        condition.temperature.fahrenheit = this.convertToFahrenheit(data[i].Temperature.Value);
                        condition.weatherIcon = data[i].WeatherIcon;
                        condition.weatherText = data[i].IconPhrase;

                        this.twelveHourlyForecasts.push(condition);
                    }

                    resolve();
                });
            });
        },
        getDailyForecasts: function () {
            return new Promise((resolve, reject) => {
                AccuWeatherAPI.dailyForecasts(this.cityKey, data => {
                    if(!data) {
                        reject();
                    }

                    this.fiveDailyForecasts = [];

                    for(let i in data.DailyForecasts) {
                        let condition = new Object();

                        condition.date = data.DailyForecasts[i].Date;
                        condition.temperature = new Object();
                        
                        condition.temperature.min = new Object();
                        condition.temperature.max = new Object();
                        
                        condition.temperature.min.celsius = data.DailyForecasts[i].Temperature.Minimum.Value;
                        condition.temperature.min.fahrenheit = this.convertToFahrenheit(data.DailyForecasts[i].Temperature.Minimum.Value);

                        condition.temperature.max.celsius = data.DailyForecasts[i].Temperature.Maximum.Value;
                        condition.temperature.max.fahrenheit = this.convertToFahrenheit(data.DailyForecasts[i].Temperature.Maximum.Value);

                        condition.day = new Object();
                        condition.night = new Object();

                        condition.day.weatherIcon = data.DailyForecasts[i].Day.Icon;
                        condition.day.weatherText = data.DailyForecasts[i].Day.IconPhrase;

                        condition.night.weatherIcon = data.DailyForecasts[i].Night.Icon;
                        condition.night.weatherText = data.DailyForecasts[i].Night.IconPhrase;

                        this.fiveDailyForecasts.push(condition);
                    }

                    resolve();
                });
            });
        },
        // Busca por localização e atualização das informações climáticas.
        searchLocation: function () {
            let searchString = this.$refs.citySearch.value; // Valor do input.

            this.loading = true; // Ativa o loading.
            this.getDate();

            // Consulta as coordenadas geográficas através de "String"
            this.getLocationBySearch(searchString).then(() => {
                // Consulta a key da AccuWeatherAPI para a localização.
                this.getCityKey()
                    .then(() => {
                        this.getCurrentConditions(); // Recebe as condições atuais.
                        this.getHourlyForecasts(); // Recebe a previsão das próximas 12 horas.
                        this.getDailyForecasts(); // Recebe a previsão dos próximos 5 dias. 
                    })
                    .then(() => this.forceRerender()); // Renderiza os componentes com os dados atualizados.
            });
        },
        convertToFahrenheit: function (celsius) {
            return (celsius * (9/5)) + 32;
        },
        convertToCelsius: function (fahrenheit) {
            return ((fahrenheit - 32) * 5/9);
        },
        forceRerender: function () {
            this.currentKey += 1;
            this.dailyKey += 1;
            this.hourlyKey += 1;
        },
    },
}
</script>

<style>
    .background-container-app {
        width: 100vw;
        height: 100vh;
        position: relative;
    }
</style>