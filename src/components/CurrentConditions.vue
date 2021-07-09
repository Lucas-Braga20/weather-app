<template>
    <div class="container-current-conditions">
        <div class="header">
            <div class="container-title">
                <i class="fas fa-map-marker-alt"></i>
                <h2>{{ getLocation }}</h2>
            </div>
            <span>{{ getDate }}</span>
        </div>
        <div class="body">
            <div class="current-condition">
                <img class="icon" width="100" :src="'https://www.accuweather.com/images/weathericons/' + weatherIcon + '.svg'">
                <div class="info">
                    <div class="temp">{{ getTemp }}</div>
                    <div class="text">{{ weatherText }}</div>
                </div>
            </div>
            <div class="wind">
                <div class="container-title">
                    <i class="fas fa-wind"></i>
                    <h3>Vento</h3>
                </div>
                <div class="wind-body">
                    <div class="result">
                        <span>{{ getWind }}</span>
                    </div>
                </div>
            </div>
            <div class="humidity">
                <div class="container-title">
                    <i class="fas fa-tint"></i>
                    <h3>Umidade</h3>
                </div>
                <div class="humidity-body">
                    <div class="result">
                        <span>{{ getHumidity }}</span>
                    </div>
                </div>
            </div>
            <div class="uv-index">
                <div class="container-title">
                    <i class="far fa-sun"></i>
                    <h3>Índice Máximo de UV</h3>
                </div>
                <div class="uv-index-body">
                    <div class="result">
                        <span>{{ UVIndex }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const week = new Array('Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado');
const month = new Array('Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez');
const formatTime = function (hours, minutes) {
    let period;
    let formattedMinutes;
    let formattedHours;

    minutes < 10 ? formattedMinutes = '0' + minutes : formattedMinutes = minutes; // Mantém os minutos sempre com duas casas.
    hours > 12 ? formattedHours = `${hours - 12}` : formattedHours = `${hours}`; // Utiliza o sistema de 12hrs (am - pm).
    hours > 0 && hours < 12 ? period = 'am' : period = 'pm'; // Define o período

    return `${formattedHours}:${formattedMinutes} ${period}`; // Retorna a hora formatada.
};

export default {
    // Recebe os dados por propriedades.
    props: {
        cityName: String,
        regionName: String,
        date: Date,
        weatherIcon: Number,
        weatherText: String,
        temperature: Object,
        wind: Object,
        humidity: Number,
        UVIndex: Number,
    },
    // Formata os valores recebidos pelas propriedades.
    computed: {
        getLocation: function () {
            return `${this.cityName}, ${this.regionName}`;
        },
        getDate: function () {
            return `${week[this.date.getDay()]} | ${this.date.getDate()} ${month[this.date.getMonth()]} ${this.date.getFullYear()} | ${formatTime(this.date.getHours(), this.date.getMinutes())}`;
        },
        getTemp: function () {
            return `${this.temperature.celsius}°C`;
        },
        getHumidity: function () {
            return `${this.humidity}%`;
        },
        getWind: function () {
            return `${this.wind.direction} ${this.wind.speedValue} ${this.wind.unit}`;
        },
    },
}
</script>