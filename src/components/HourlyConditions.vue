<template>
    <div class="container-hourly-conditions">
        <div class="header">
            <div class="container-title">
                <i class="fas fa-clock"></i>
                <h2>Variação da Temperatura nas próximas 12 horas</h2>
            </div>
        </div>
        <div class="body">
            <LineChart :conditions="conditions"/>
        </div>
    </div>
</template>

<script>
import LineChart from './LineChart.vue';

export default {
    components: {
        LineChart,
    },
    // Recebe as condições para as próximas 12 horas e tranfere para o componente filho "LineChart" que irá transformar os dados em gráfico.
    props: {
        conditions: Array,
    },
}
</script>