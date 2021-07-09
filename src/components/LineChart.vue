<template>
    <div ref="chart" id="chart"></div>
</template>

<script>
// Para entender melhor o funcionamento da biblioteca Google Charts, consulte a documentação: https://developers.google.com/chart/interactive/docs/quick_start

export default {
    data() {
        return {
            // Opções para a formatação do gráfico (Google Charts).
            options: {
                focusTarget: 'category',
                tooltip: { isHtml: true },
                legend: {position: 'none'},

                title: '(Temperatura X Horário)',
                backgroundColor: { fill:'transparent' },

                width: 650,
                height: 300,

                titleTextStyle: { color: '#2C86DC' },
                vAxis: {
                    textStyle: { color: '#2C86DC' },
                    gridlines: {color: '#868686'},
                },
                hAxis: {
                    textStyle: { color: '#2C86DC' },
                },
            },
            rows: [], // Dados que serão inseridos no gráfico.
        };
    },
    // Recebe as condições.
    props: {
        conditions: Array,
    },
    mounted: function () {
        // Utiliza o plugin para carregar o script Google Charts.
        this.$loadScript("https://www.gstatic.com/charts/loader.js")
            .then(() => {
                window.google.charts.load('current', {'packages':['corechart']}); // Define o pacote a ser utilizado.
            })
            .then(() => {
                setTimeout(() => this.drawChart(this.conditions), 1000); // Cria o gráfico com atraso de 1 segundo, para que o pacote seja carregado previamente.
            });
    },
    methods: {
        drawChart: function (hourlyConditions) {
            // Desenha o gráfico com base nos valores passados por parâmetro.
            this.getRows(hourlyConditions);

            var dataTable = new window.google.visualization.DataTable();

            dataTable.addColumn('timeofday', 'Horário'); // Coluna do horário.
            dataTable.addColumn('number', 'Temperatura'); // Coluna da tempertura.
            dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); // Coluna do tooltip (Temperatura, Ícone e Condição).

            dataTable.addRows(this.rows);

            var chart = new window.google.visualization.LineChart(this.$refs.chart);
            chart.draw(dataTable, this.options);

            this.emitter.emit('stopLoading');
        },
        // Recebe a data e transforma no formato utilizado pelo Google Charts.
        getTimeOfDay: function (initialHour, stringDate) {
            let date = new Date(stringDate);
            let initialDate = new Date(initialHour); // É necessário saber a hora inicial, pois o horário não pode ser resetado após as 23 Horas (Ex: 20, 21, 22, 23, 24, 25...).

            let v = new Array();
            let f;

            v.push(date.getHours() < initialDate.getHours() ? date.getHours() + 24 : date.getHours());
            v.push(date.getMinutes());
            v.push(date.getSeconds());

            f = this.formatTime(date.getHours(), date.getMinutes());

            return {v, f};
        },
        // Cria a string de Tooltip para inserir no gráfico.
        getTooltip: function (temp, unitType, icon, text) {
            return `${temp}${unitType} <img class="chart-icon" width="20" src="https://www.accuweather.com/images/weathericons/${icon}.svg"><div class="chart-text">${text}</div>`;
        },
        // Cria as linhas da tabela.
        getRows: function (hourlyConditions) {
            this.rows = new Array();

            for(let i = 0; i < hourlyConditions.length; i++) {
                let row = new Array();

                row.push(this.getTimeOfDay(hourlyConditions[0].hour, hourlyConditions[i].hour));
                row.push(hourlyConditions[i].temperature.celsius);
                row.push(this.getTooltip(hourlyConditions[i].temperature.celsius, '°C', hourlyConditions[i].weatherIcon, hourlyConditions[i].weatherText));

                this.rows.push(row);
            }
        },
        formatTime: function (hours, minutes) {
            let period;
            let formattedMinutes;
            let formattedHours;

            minutes < 10 ? formattedMinutes = '0' + minutes : formattedMinutes = minutes; // Mantém os minutos sempre com duas casas.
            hours > 12 ? formattedHours = `${hours - 12}` : formattedHours = `${hours}`; // Utiliza o sistema de 12hrs (am - pm).
            hours > 0 && hours < 12 ? period = 'am' : period = 'pm'; // Define o período

            return `${formattedHours}:${formattedMinutes} ${period}`; // Retorna a hora formatada.
        },
    },
};
</script>

<style scoped>
    #chart {
        height: 300px;
        background-color: white;
        border-radius: 10px;
    }
</style>