<template>
    <div class="daily">
        <div class="header">
            <div class="date">{{ getDay }}</div>
            <div class="temp">{{  getTemp }}</div>
        </div>
        <div class="body">
            <div class="condition day">
                <div class="info">
                    <span class="mark">Dia:</span>
                    <img width="25" :src="'https://www.accuweather.com/images/weathericons/' + day.weatherIcon + '.svg'">
                </div>
                <div class="content">{{ day.weatherText }}</div>
            </div>
            <div class="condition day">
                <div class="info">
                    <span class="mark">Dia:</span>
                    <img width="25" :src="'https://www.accuweather.com/images/weathericons/' + night.weatherIcon + '.svg'">
                </div>
                <div class="content">{{ night.weatherText }}</div>
            </div>
        </div>
    </div>
</template>

<script>
const month = new Array('Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez');

export default {
    props: {
        date: String,
        temperature: Object,
        day: Object,
        night: Object,
    },
    // Formata os valores recebidos pelas propriedades.
    computed: {        
        getDay: function () {
            let date = new Date(this.date);

            return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`;
        },
        getTemp: function () {
            return `${this.temperature.min.celsius}°C / ${this.temperature.max.celsius}°C`;
        },
    },
}
</script>