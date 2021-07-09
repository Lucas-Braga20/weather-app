<template>
    <div class="container-daily-conditions">
        <div class="header">
            <div class="container-title">
                <i class="fas fa-calendar-alt"></i>
                <h2>Variação da Temperatura nos próximos 5 dias</h2>
            </div>
        </div>
        <ul>
            <li v-for="(condition, index) in conditions" :key="index">
                <Day
                    :date="condition.date"
                    :temperature="condition.temperature"
                    :day="condition.day"
                    :night="condition.night"/>
            </li>
        </ul>
    </div>
</template>

<script>
import Day from './Day.vue';

export default {
    components: {
        Day,
    },
    // Recebe as condições através de propriedades.
    props: {
        conditions: Object,
    },
};
</script>