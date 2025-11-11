<template>
  <Doughnut :options="chartOptions" :data="chartData" />
</template>

<script>
import { Chart as ChartJSD, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJSD.register(ArcElement, Tooltip, Legend)
ChartJSD.defaults.font.family = 'IranYekan'
ChartJSD.defaults.font.size = 10
ChartJSD.overrides['doughnut'].plugins.legend.display=false
export default {
  name: 'DoughnutChart',
  components: { Doughnut },
  props: {
    chartData: {
      required: true,
      default: {}
    },
    chartOptions: {
      required: false,
      default: { responsive: true, maintainAspectRatio: false }
    }
  }
}
</script>
